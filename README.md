## Dependencies
  - Python 3
  - Jupyter Notebook or Jupyter Lab

## How to Run
  1. Clone this repository to your local computer. If you would like to test the tool on your own dataset, ensure that the zip folder containing your Facebook data is in the same directory as the files in this repository. 
  2. Install all Python package dependencies by running `pip install -r requirements.txt` on your terminal. 
  3. Open Jupyter Notebook or Jupyter Lab.
  4. By default, the tool analyzes `facebook-sampledataset`. If you would like to test the tool on your own dataset,
      - If your zip file ends with `tar`, uncomment line 4 in the first code block and change the line to reflect the path to your zip file. 
`!tar -xvf {path_to_facebook_zip}`
      - If your zip file ends with `zip`, uncomment line 7 in the first code block and change the line to reflect the path to your zip file. 
`!unzip {path_to_facebook_zip}`
      - Change line 12 in the first code block to the name of your Facebook dataset. `os.path.join(os.getcwd(),'facebook-yourname')`
  5. Run the notebook. 
  6. Open terminal and run 
`python -m SimpleHTTPServer`
Depending on your Python version, you may get the error 
`C:\Python33\python.exe: No module named SimpleHTTPServer`
In this case, run
`python -m http.server 8000`
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
<img src="https://latex.codecogs.com/png.latex?\inline&space;Tie&space;strength=&space;-0.76&space;(days&space;since&space;last&space;communication)&plus;0.111&space;(wall&space;intimacy&space;words)&plus;&space;0.135&space;(inbox&space;positivity)&space;&plus;0.299&space;(number&space;of&space;wall&space;posts)&plus;0.299&space;(messages&space;exchanged)&space;&plus;&space;0.299&space;(number&space;of&space;comments)" title="Tie strength= -0.76 (days since last communication)+0.111 (wall intimacy words)+ 0.135 (inbox positivity) +0.299 (number of wall posts)+0.299 (messages exchanged) + 0.299 (number of comments)" />

We followed the linear regression stated in the findings in Gilbert et al.’s paper to predict tie strength. The beta coefficients obtained from the paper were days since last communication, wall intimacy words, inbox positivity. Since we don’t have the coefficients on the number of messages exchanged, number of comments on tie’s content, number of posts written on tie’s wall, we used the beta coefficients of wall words exchanged in the paper as an approximation. Referring back to Burke et al.’s  paper, since the number of wall posts, comments and messages are all grouped into a category of “composed direct communications” and it was proven that these have a significant effect on tie strength, we made an assumption that these three metrics has the same effect on tie strength and therefore, have the same beta coefficients.

## Data Visualization
**Emotion and Communication Style Analysis:** The IBM Watson Tone Analyzer (general-purpose endpoint) was used to analyze emotions and communication styles for the 50 most recent messages between the user and the friend. The tones analyzed consist of anger, fear, joy, sadness, analytical, confident, and tentative; a neutral tone was given if a prominent tone could not be identified. The tone analyzed is merely used for data visualization purposes in order to provide users with more understanding of prominent tones in their message and was not used to predict tie strength.

