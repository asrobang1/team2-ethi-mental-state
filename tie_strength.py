#!/usr/bin/env python
# coding: utf-8

import os # to iterate through the directory
import json # to read the json files
import pandas as pd # for data handling
import numpy as np
from pandas.io.json import json_normalize
import re
from empath import Empath
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import math
from ibm_watson import ToneAnalyzerV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

# corrects the decoding to decode as utf-8 instead of latin_1
def parse_obj(obj):
    for key in obj:
        if isinstance(obj[key], str):
            obj[key] = obj[key].encode('latin_1').decode('utf-8')
        elif isinstance(obj[key], list):
            obj[key] = list(map(lambda x: x if type(x) != str else x.encode('latin_1').decode('utf-8'), obj[key]))
        pass
    return obj

# takes the friends.json file and returns a dataframe
def create_friends_dataframe(friends_json_file):
    fp = open(friends_json_file,)
    friends_json = json.load(fp,object_hook=parse_obj)
    friends_list = friends_json['friends']
    print (len(friends_list))
    df = pd.DataFrame(friends_list,columns=['name','timestamp'])
    df['timestamp']= df['timestamp'].apply(lambda ts: datetime.utcfromtimestamp(ts))
    dt_now = datetime.utcnow()
    df['days since being friends'] = df['timestamp'].apply(lambda ts: dt_now-ts)
    
    return df

# adds the comment frequency with each friend to the dataframe
def get_comment_frequency(comments_json_file, df):
    fp1 = open(comments_json_file,)
    comments_json = json.load(fp1,object_hook=parse_obj)
    comments = comments_json['comments']
    df['comment frequency'] = 0
    try:
        author = comments[0]['data'][0]['comment']['author'] # name of the person in concern. (eg: Harini)
        pattern_str ="%s [a-zA-Z]* [a-zA-Z]* ([a-zA-Z \.]*)'s [a-zA-Z]*" % author
    except:
        print("Error: Couldn't get author name!")
        return
    
    for comm in comments:
        title = comm['title']
        match = re.search(pattern_str,title)
        # print(match.group(0),"-->", match.group(1)) # Prints comment title --> friend name extracted
        if match == None:
        #  Match error
          continue
        friend = match.group(1)
        ind = df.loc[df.name == friend].index
        if len(ind) == 0:
            # not in friend list
            #  (eg: 'Harini replied to a comment', 'Harini replied to her own comment' are ignored.)
            continue
        elif len(ind) > 1:
            # more than one friend share the same extracted name
            continue
        else:
            row_num = ind[0]
            df.at[row_num,'comment frequency'] += 1
          
# function that cleans the json file containing posts
def cleaning(path):
    ''' given the json post file path as a string, 
    return a clean dataframe time timestamps, title, posts, & tags'''

    # normalize nested json file
    post_data = open(path)
    posts = json.load(post_data,object_hook=parse_obj)
    posts_df = pd.json_normalize(posts)

    # Extract the post to a new column called "post"
    posts_in_data = (
        posts_df["data"]
        .apply(pd.Series)[0]
        .apply(pd.Series)['post']
    )
    posts_df['post'] = posts_in_data

    # drop empty posts
    posts_df = posts_df.dropna(subset = ['post'])

    # Extract the tags to a new column 
    tags_in_data = posts_df['tags'].apply(pd.Series)
    posts_df['tags'] = tags_in_data.apply(
        lambda x: ','.join(x.dropna().astype(str)),
        axis=1
    )

    # only take the column that we need
    field = ['timestamp', 'title', 'post', 'tags']
    posts_df = posts_df[field]

    return posts_df

# gets the post metrics and updates the dataframe 
def get_post_metrics(df, post_file):

    #define empath
    lexicon = Empath()
    # this is the eleven categories which we will use
    eleven_categories = ['family', 'friends', 'home', 'sexual', 'swears', 
    'work', 'leisure', 'money', 'body', 'religion', 'health']

    # clean the post data
    post_df = cleaning(post_file) # need the cleaning function from above!

    # find post frequency for each friend
    df['post frequency'] = 0
    df['empath'] = 0
    for friend in df.name:
        ind = df.loc[df.name == friend].index[0]
        title = post_df[post_df['title'].str.contains(friend, na = False)]
        tags = post_df[post_df['tags'].str.contains(friend, na = False)]
        friend_post = pd.concat([title, tags])
        df.at[ind, 'post frequency'] = len(friend_post.index)

            # if there is a post, find empath analysis
        if df.loc[ind, 'post frequency'] != 0:
            # sum the empath analysis for each post on eleven categories
            friend_post['empath'] = friend_post['post'].apply(lambda x: 
            sum(lexicon.analyze(x, categories = eleven_categories).values()))
            # find the average of the empath score for each post
            df.at[ind, 'empath'] = np.mean(friend_post['empath'])
    return df

# gets the number of messages with each friend and updates the dataframe
def get_message_frequency(inbox_path):
    chats = os.listdir(inbox_path)
    
    df['number of messages'] = 0
    
    for chat in chats: 
        messages = 0
        try:
            message_file = open(os.path.join(inbox_path,chat,'message_1.json'))
            data = json.load(message_file,object_hook=parse_obj)
            i = 1

            if (len(data['participants']) == 2):
                messages = messages + len(data['messages'])
                i = i + 1	

                # doesn't check who sent the last message 
                last_timestamp = ((data['messages'])[0])['timestamp_ms'] / 1000
                last_message = datetime.fromtimestamp(last_timestamp)

                while (os.path.exists(os.path.join(inbox_path,chat,f'message_{i}.json'))):
                    message_file = open(os.path.join(inbox_path,chat,f'message_{i}.json'))
                    data = json.load(message_file,object_hook=parse_obj)
                    messages = messages + len(data['messages'])
                    i = i + 1

                friend_name = ((data['participants'])[0])['name']
                first_message_index = len(data['messages']) - 1
                first_timestamp = ((data['messages'])[first_message_index])['timestamp_ms'] / 1000
                first_message = datetime.fromtimestamp(first_timestamp)

                ind = df.loc[df.name == friend_name].index
                if len(ind) == 0:
                    # not in friend list
                    continue
                elif len(ind) > 1:
                    # more than one friend share the same extracted name
                    continue
                else:
                    row_num = ind[0]
                    df.at[row_num,'number of messages'] = messages
                    df.at[row_num,'date of last message'] = last_message
                    df.at[row_num,'date of first message'] = first_message
                    df.at[row_num,'chat hash'] = chat
        except:
            continue
            
# runs the VADER sentiment analysis 
def sentiment_analyzer_scores(sentence):
    score = analyser.polarity_scores(sentence)
    return score

# extracts the last 50 messages with each friend to be analyzed with VADER
def get_chat_vader(inbox_path,friend_analyze):
    ind = df.loc[df.name == friend_analyze].index
    if len(ind) == 0:
        print ('not in friend list')
    elif len(ind) > 1:
        print ('more than one friend share the same extracted name')
        # print("ERROR!",title, friend, len(ind), df.iloc(ind[0]), df.iloc(ind[1]))
    row_num = ind[0]
    hash = df.at[row_num,'chat hash'] 
    if not (isinstance(hash, float) and  math.isnan(hash)):
        chat_path = open(os.path.join(inbox_path,hash,'message_1.json'))
        chat_data = json.load(chat_path)
        chat_to_analyze = []
        for message in chat_data['messages']:
            if 'content' in message:
                chat_to_analyze.append(sentiment_analyzer_scores(message['content'])['pos'])
        lst = chat_to_analyze[:50]
        if lst != None:
            return np.average(chat_to_analyze[:50])
        else:
            return 0

    else:
        return 0

# runs the VADER positivity analysis on the extracted chat messages 
def get_vader_positivity(df, inbox_path):

    df['vader positivity'] = None
    for friend in df.name:
        ind = df.loc[df.name == friend].index[0]
        df.at[ind, 'vader positivity'] = get_chat_vader(inbox_path,friend)
            
    return df

# calculates for tie strength score using the formula based on the research by Gilbert et al.
def linear_regression(df):
    field = ['days since last communication', 'empath', 'vader positivity', 'post frequency', 'number of messages', 'comment frequency']
    df_normal =  normalize(df[field])
    y = (-0.76) * df_normal['days since last communication'] + 0.111 * df_normal['empath'] + 0.135 * df_normal['vader positivity'] + 0.299 * df_normal['post frequency'] + 0.299 * df_normal['number of messages'] + 0.299 * df_normal['comment frequency']
    y_max = max(y)
    y_min = min(y)
    y_scaled = (y - y_min) / (y_max - y_min)
    return y_scaled
    
# normalizes data
def normalize(df):
    result = df.copy()
    for feature_name in df.columns:
        if np.std(df[feature_name]) == 0:
            result[feature_name] = 0
        else:
            result[feature_name] = (df[feature_name] - np.mean(df[feature_name])) / (np.std(df[feature_name]))
    return result

# updates the tones with each friend
def update_friend_tone(inbox_path,friend_analyze):
    
    ind = df.loc[df.name == friend_analyze].index
    if len(ind) == 1: # checks if the friend's name is in the dataframe and if it is unique
        row_num = ind[0]
        hash = df.at[row_num,'chat hash'] 

        chat_path = open(os.path.join(inbox_path,hash,'message_1.json'))
        chat_data = json.load(chat_path)
        chat_to_analyze = []
        counter = 0    
        for message in chat_data['messages']:
            if 'content' in message:
                chat_to_analyze.append(message['content'])
                counter += 1
            if counter == 50:
                break
        
        sentences_to_analyze = ' '.join(chat_to_analyze)
        paragraph = {"text":sentences_to_analyze}
        if (len(paragraph['text']) > 0):
            chat_results_tone = ta.tone(paragraph).get_result()['document_tone']['tones']
            
            overall_tone = ''
            overall_tone_score = 0
            for tone in possible_tones:
                for each in chat_results_tone:
                    if (each['tone_name'] == tone):
                        df.loc[row_num,tone] = each['score']
                    if (each['score'] > overall_tone_score):
                        overall_tone_score = each['score']
                        overall_tone = each['tone_name']
            df.at[row_num,'tone'] = overall_tone
            df.at[row_num,'score'] = overall_tone_score


if __name__ == '__main__':
    # directory path to your file
    startpath = os.path.join(os.getcwd(),'facebook-sampledataset') # change the folder name here

    # creates a database of the user's friends 
    df = create_friends_dataframe(os.path.join(startpath,'friends','friends.json'))
    df = df.drop_duplicates(subset=['name'],keep=False)

    # get the comments, posts, and messages metrics
    get_comment_frequency(os.path.join(startpath,'comments','comments.json'),df)
    df = get_post_metrics(df, os.path.join(startpath,'posts','your_posts_1.json'))
    get_message_frequency(os.path.join(startpath,'messages','inbox'))

    # analyzes the positivity or negativity of the posts using VADER Sentiment Analysis
    analyser = SentimentIntensityAnalyzer()
    df = get_vader_positivity(df, os.path.join(startpath,'messages','inbox'))

    # clean datetime metrics
    df['days since being friends'] = df['days since being friends'].astype('timedelta64[h]') / 24
    dt_now = datetime.utcnow()
    df['days since last communication'] = df['date of last message'].apply(lambda ts: dt_now-ts)
    df['days since last communication'] = df['days since last communication'].astype('timedelta64[h]') / 24
    df['days since last communication'] = df['days since last communication'].fillna(df['days since being friends'])
    df = df.drop(['timestamp', 'date of first message', 'date of last message'], axis = 1)
    df.sort_values(by = ['number of messages'], ascending = False)

    # calculates for tie strength
    df['tie strength'] = linear_regression(df)
    df = df.sort_values(by = ['tie strength'], ascending = False) # sort by the tie strength
    df = df.head(300) # cap at 300 'closest' friends

    # IBM Watson Tone Analyzer for the last 50 chat messages with each friend
    apikey = 'rL9l_qk3EhoKpcQW7PapS98Hvm06Eb9_oLvtHtjGxKDM'
    url = 'https://api.jp-tok.tone-analyzer.watson.cloud.ibm.com/instances/4c2d9078-27dd-48c9-985c-7ceedd475c06'
    authenticator = IAMAuthenticator(apikey)
    ta = ToneAnalyzerV3(version='2017-09-21', authenticator=authenticator)
    ta.set_service_url(url)

    friend_analyze = df[df['number of messages'] != 0]['name'].values.tolist()
    possible_tones = ['Anger','Fear','Joy','Sadness','Analytical','Confident','Tentative']
    for tone in possible_tones:
        df[tone] = -1

    for friend in friend_analyze:
        update_friend_tone(os.path.join(startpath,'messages','inbox'),friend)

    df.drop(columns=['comment frequency', 'post frequency', 'empath', 'chat hash', 'vader positivity'], inplace = True) 
    # change some of the type of the values for visualization
    int_metrics = ['days since being friends', 'days since last communication']
    for metric in int_metrics:
        df[metric] = df[metric].astype(int)
    decimal_metrics = ['tie strength','Anger','Fear','Joy','Sadness','Analytical','Confident','Tentative', 'score']
    for metric in decimal_metrics:
        df[metric] = df[metric].astype(float).round(decimals = 2)

    # Prepare CSVs for visualization
    df_ten = df.copy()
    df_ten = df_ten.head(10)
    df_ten = df_ten[['name', 'tone', 'tie strength']]
    df_ten.to_csv('df_ten.csv',index=False)
    
    df = df.sort_values(by = ['name'], ascending = True) # sort alphabetically
    # add a dummy row for the visualization 
    dummy_row = pd.DataFrame({'name':'Select a friend!'}, index =[0]) 
    df = pd.concat([dummy_row, df]).reset_index(drop = True) 
    # export the dataframe to csv file
    df.to_csv('df.csv',index=False)