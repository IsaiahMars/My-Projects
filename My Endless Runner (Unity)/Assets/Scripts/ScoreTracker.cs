using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;
using TMPro;

public class ScoreTracker : MonoBehaviour
{
    [SerializeField] double currentScore, topScore, distance;  // Variables used to keep track of the score
    public static int coinCount;
    public TextMeshProUGUI scoreText, topScoreText, distanceText, coinText;
    public TextMeshProUGUI gameOverScoreText, gameOverDistanceText;
    public Animator animator;

    private double scoreMultiplier = 5;

    void Start(){
        currentScore = 0;               // reset current score to 0
        distance = 0;                         
        topScore = PlayerPrefs.GetInt("highscore", 0);   // assign topScore to player's best score
        coinCount = PlayerPrefs.GetInt("coinCount", 0);
    }
    
    void Update()
    {
        bool gameOver = animator.GetBool("gameOver");

        if(!gameOver){
            scoreUpdate(); 
            distanceTracker(); 
            coinTracker();
        }
        else{
            gameOverDistanceText.text = distanceText.text;
            gameOverScoreText.text = scoreText.text;
        }
    }

    void scoreUpdate(){
        currentScore += scoreMultiplier * Time.deltaTime;             // increments score by 1 every 1/5th of a second
        scoreMultiplier += .001;
                                    
        string roundedScoreText = Math.Round(currentScore).ToString(); // variable used to round score and convert its type to string
        scoreText.text = roundedScoreText;  // assigning scoreText to the rounded currentScore   
                            

        if(currentScore > topScore){
            PlayerPrefs.SetInt("highscore", (int)currentScore);  // using PlayerPrefs to keep track of highscore
            PlayerPrefs.Save();                                  
            topScoreText.text = roundedScoreText;
        }
        else{
            topScoreText.text = topScore.ToString();                
        }

    }

    void distanceTracker(){
        distance += scoreMultiplier * Time.deltaTime;
        string roundedDistanceText = Math.Round(distance, 1).ToString() + "m";
        distanceText.text = roundedDistanceText;
    }

    void coinTracker(){
        PlayerPrefs.SetInt("coinCount", coinCount);
        coinText.text = coinCount.ToString();
    }

    
}
