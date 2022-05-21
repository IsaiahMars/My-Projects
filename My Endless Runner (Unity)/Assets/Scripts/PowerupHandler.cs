using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerupHandler : MonoBehaviour
{
    public Animator animator;
    public GameObject player;

    private bool timeSlowed = false;
    private bool coinMagnet = false;

    private float timeStartedLerping, lerpTime;

    void Start()
    {
        timeSlowed = false;
        coinMagnet = false;
    }

    // Update is called once per frame
    void Update()
    {
        if(timeSlowed && Time.timeScale == 1f ){
            Time.timeScale = .5f;
        }

        if(coinMagnet){
            Invoke("magnetReset", 7f);
            for(int i = 0; i<ObstacleGenerator.instantiatedCoins.Count; i++){
                if(ObstacleGenerator.instantiatedCoins[i].transform.position.z - player.transform.position.z < 5){
                    ObstacleGenerator.instantiatedCoins[i].transform.position = Vector3.MoveTowards(ObstacleGenerator.instantiatedCoins[i].transform.position, player.transform.position, 30 * Time.deltaTime);
                }
            }
        }
        
    }

    void bigJump(){
        Physics.gravity = new Vector3(0f, -6.81f, 0f); 
        animator.SetFloat("jumpSpeedMultiplier", .7f);
        Invoke("gravityReset", 10f);
    }

    void gravityReset(){
        Physics.gravity = new Vector3(0f, -9.81f, 0f);
        animator.SetFloat("jumpSpeedMultiplier", 1f);
    }

    void timeSlow(){
        Time.timeScale = .5f;
        Invoke("timeReset", 5f);
        timeSlowed = true;
    }

    void timeReset(){
        Time.timeScale = 1f;
        timeSlowed = false;
    }


    void magnetReset(){
        coinMagnet = false;
    }

    void OnTriggerEnter(Collider other){
        if(other.transform.tag == "bigJump"){
            bigJump();
            Destroy(other.gameObject);
            ObstacleGenerator.instantiatedPowerups.Remove(other.gameObject);
        }
        if(other.transform.tag == "coinMagnet"){
            coinMagnet = true;
            Destroy(other.gameObject);
            ObstacleGenerator.instantiatedPowerups.Remove(other.gameObject);
        }
        if(other.transform.tag == "timeSlow"){
            timeSlow();
            Destroy(other.gameObject);
            ObstacleGenerator.instantiatedPowerups.Remove(other.gameObject);
        }
    }

    

}
