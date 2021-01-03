## Dependencies
  - Python 3 (or);
  - Jupyter Notebook or Jupyter Lab

## How to Run
  1. Clone this repository to your local computer. If you would like to test the tool on your own dataset, ensure that the zip folder containing your Facebook data is in the same directory as the files in this repository. 

*P.S.* 
  - *Check out this [link](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) for tutorial on cloning repository* 
  - *Check out this [link](https://web.facebook.com/help/1701730696756992?_rdc=1&_rdr) for tutorial to download your facebook data*
  - *When downloading your facebook dataset make sure it is in `json` format*
  
### Jupyter Notebook or Jupyter Lab
  2. Open `tie_strength.ipynb` on Jupyter Notebook or Jupyter Lab.
  3. By default, the tool analyzes `facebook-sampledataset`. If you would like to test the tool on your own dataset,
      - Option 1: Unzip your file manually then change line 12 in the first code block to the name of your Facebook dataset. `os.path.join(os.getcwd(),'facebook-username')`
      - Option 2:
        - If your zip file ends with `tar`, uncomment line 4 in the first code block and change the line to reflect the path to your zip file. `!tar -xvf {path_to_facebook_zip}`
        - If your zip file ends with `zip`, uncomment line 7 in the first code block and change the line to reflect the path to your zip file. 
`!unzip {path_to_facebook_zip}`
        - Change line 12 in the first code block to the name of your Facebook dataset. `os.path.join(os.getcwd(),'facebook-username')`
  4. Uncomment `!pip install -r requirements.txt` (on the second line of code block 2)
  5. Run the notebook. 
  6. Open terminal and run `python -m SimpleHTTPServer`
      - Depending on your Python version, you may get the error `C:\Python33\python.exe: No module named SimpleHTTPServer`. In this case, run `python -m http.server 8000`
  7. Go to http://localhost:8000 on your browser.
  
### Python
  2. Install all Python package dependencies by running `pip install -r requirements.txt` on your terminal.
  3. Unzip your facebook dataset.
  4. Change directory on your terminal to the folder containing the clone repository
  5. Run `python tie_strength.py facebook-username`
  6. Run `python -m SimpleHTTPServer`
      - Depending on your Python version, you may get the error `C:\Python33\python.exe: No module named SimpleHTTPServer`. In this case, run `python -m http.server 8000`
  7. Go to http://localhost:8000 on your browser.

## Project Scope
New communication technologies are often met with questions about their impact on psychological well-being. The goal of this project is to give users insight into how Facebook data reflects their mental well-being by investigating social ties of Facebook friendships. To solve the problem, a predictive model was created to map Facebook data to tie strength and identify strong, and weak ties amongst Facebook friendships, as well as observe changes in psychological wellbeing depending on tie strength and the nature of communication.
### Research
Three main papers were used to supplement this project. 
  1. Burke et al.’s *‘The Relationship Between Facebook Use and Well-Being Depends on Communication Type and Tie Strength’* (2016) showed that receiving more personalized communication—targeted, composed text—from strong ties is associated with improvements in well-being. With this, further research was done to understand how to predict tie strength using Facebook data.
  
  2. Burke et al.’s *‘Growing closer on facebook: changes in tie strength through social network site use’* (2014) showed that composed direct communications on Facebook, including messages written to tie, comments written on tie’s content and posts written on tie’s wall was associated with significant increases in tie strength. On the other hand, other types of communication such as likes and pokes does not have a significant effect.
  
  3. Gilbert et al.’s *‘Predicting tie strength with social media’* (2009) concluded the top 15 predictive variables with highest standardized beta coefficients using a linear regression model to examine how Facebook data can predict tie strength. 

## Solution
In order to create a predictive model to determine a magnitude for tie strength, several metrics and a linear regression model was used.

### Metrics
Metrics 1-3 were taken from Burke et al.’s (2014) and metrics 4-6 Gilbert et al.’s (2009) paper. 
  1. **Number of messages exchanged** 
  2. **Number of comments on tie’s content**
  3. **Number of posts written on tie’s wall**
  4. **Inbox positive emotion words:** We used VADER (Valence Aware Dictionary for Sentiment Reasoning) to analyze all inbox messages to come up with a number for positivity scales from 0 to 1, with 1 being the most positive. Messages are limited to the most recent 50 messages to accurately reflect the user's tie strength at the moment. 
    - In Gilbert et al.’s paper, inbox positive emotion words were measured by referring to matches against the LIWC category Positive Emotion. The Positive Emotion category includes words like birthday, congrats and sweetheart. However, VADER was used as a substitute because we don’t have access to LIWC.
  5. **Wall intimacy words:** We used Empath to count the number of wall words matching at least one of eleven categories: Family, Friends, Home, Sexual, Swears, Work, Leisure, Money, Body, Religion, and Health. Empath was used to analyze all the wall posts between the user and the friend.
    - Gilbert et al’s paper uses LIWC for the word categories to measure wall intimacy words.
  6. **Days since last communication:** Unlike the other metrics, there is a negative correlation between days since last communication and tie strength.
  
### Linear Regression
*Tie strength= -0.76 \* (days since last communication) + 0.111 \* (wall intimacy words) + 
0.135 \* (inbox positivity) + 0.299 \* (number of wall posts) + 0.299 \* (messages exchanged) +
0.299 \* (number of comments)*

We followed the linear regression stated in the findings in Gilbert et al.’s paper to predict tie strength. The beta coefficients obtained from the paper were days since last communication, wall intimacy words, inbox positivity. Since we don’t have the coefficients on the number of messages exchanged, number of comments on tie’s content, number of posts written on tie’s wall, we used the beta coefficients of wall words exchanged in the paper as an approximation. Referring back to Burke et al.’s  paper, since the number of wall posts, comments and messages are all grouped into a category of “composed direct communications” and it was proven that these have a significant effect on tie strength, we made an assumption that these three metrics has the same effect on tie strength and therefore, have the same beta coefficients.

## Data Visualization
**Emotion and Communication Style Analysis:** The IBM Watson Tone Analyzer (general-purpose endpoint) was used to analyze emotions and communication styles for the 50 most recent messages between the user and the friend. The tones analyzed consist of anger, fear, joy, sadness, analytical, confident, and tentative; a neutral tone was given if a prominent tone could not be identified. The tone analyzed is merely used for data visualization purposes in order to provide users with more understanding of prominent tones in their message and was not used to predict tie strength.

## Disclaimer
**Friend with same name is disregarded:** When more than one friend in the friends list share the same name, it is not possible to unambiguously link interactions like messages, comments and posts to one friend. (e.g, if two friends of ‘Jan Wick’ share the name ‘Alex Nom’, it is not clear which one is referred to in the comments file containing sentences such as  “Jan Wick commented on Alex Nom’s post.” Similar unambiguity arises in identifying the friend from the participants list in message exchanges.) For this reason, we remove all such friends (who share the same name) from our analysis.

**Generalization of Linear Regression Model:** In Gilbert et al.’s paper, the adjusted R-squared of the regression stated is 0.534, meaning that the variables in the regression only explain around 50% of what makes up tie strength. We have also made approximations in some of our beta coefficients and have different ways of measuring the metrics than the papers. 

**Generalization of Positive Correlation between Tie Strength & Well-being:** We have based our project on Burke et al.’s (2016)  which states that a strong tie strength can have a positive effect on wellbeing; therefore, we assume that the tie strengths we predicted would give an insight to the degree of how well our mental state is. This model was created under this broad generalization and there are more studies that go more in-depth into well-being (Umberson, 2011); there are also other papers that point out the latter, that strong ties can cause stress or negative influence on wellbeing (Thoits, 1995). 

**Uses proprietary software (IBM Watson Tone Analyser) for analysing tones of the conversation:** First 1000 API calls per month are free after which we need to move to a paid model. This project work makes an API call per friend in the friend’s list, hence to avoid exhausting the quota, we limit the analysis to the top 300 friends with the highest tie strength values (given by the linear regression model).


## Reference
  1. Moira Burke, Robert E. Kraut, The Relationship Between Facebook Use and Well-Being Depends on Communication Type and Tie Strength, Journal of Computer-Mediated Communication, Volume 21, Issue 4, 1 July 2016, Pages 265–281, https://doi.org/10.1111/jcc4.12162 
  2. Moira Burke and Robert E. Kraut. 2014. Growing closer on facebook: changes in tie strength through social network site use. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '14). Association for Computing Machinery, New York, NY, USA, 4187–4196. DOI:https://doi.org/10.1145/2556288.2557094
  3. Eric Gilbert and Karrie Karahalios. 2009. Predicting tie strength with social media. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '09). Association for Computing Machinery, New York, NY, USA, 211–220. DOI:https://doi.org/10.1145/1518701.1518736

