using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObstacleGenerator : MonoBehaviour
{
    public Animator animator;

    public GameObject obstacles;

    
    public GameObject[] availableObstacles;
    private List<GameObject> instantiatedObstacles;
    private float[] xSpawnCoordinates = {-1.5f, 0f, 1.5f};

    public GameObject coin;
    public GameObject childCoins;
    public static List<GameObject> instantiatedCoins;

    [SerializeField] int instantiatedLast = 30;
    [SerializeField] float generatedLast = 30;
    [SerializeField] float moveSpeed;


    void Start()
    {
        instantiatedObstacles = new List<GameObject>();
        instantiatedCoins = new List<GameObject>();

        for(int i = 2; i<18; i++){
            GameObject temp = Instantiate(availableObstacles[randomNumber()], new Vector3(randomFloat(), 0, i * 13.75f), Quaternion.identity);
            temp.transform.SetParent(obstacles.transform, false);  
            instantiatedObstacles.Add(temp); 
        }
    }

    

    void Update()
    {
        bool gameOver = animator.GetBool("gameOver");

        if(!gameOver){

            if(moveSpeed > -30f){
                moveSpeed -= .001f;
            }
            
            for(int i = 0; i<instantiatedObstacles.Count; i++){                  
                instantiatedObstacles[i].transform.Translate(0, 0, (Time.deltaTime * moveSpeed));
                                                            
                if(instantiatedObstacles[i].transform.position.z <= -27.5f){ 
                    Destroy(instantiatedObstacles[i]); // This destroys the GameObject and removes it from the array if it passes behind the camera.
                    instantiatedObstacles.RemoveAt(i);
                }
            }

            for(int i = 0; i<instantiatedCoins.Count; i++){                  
                instantiatedCoins[i].transform.Translate(0, 0, (Time.deltaTime * moveSpeed), Space.World);
                instantiatedCoins[i].transform.Rotate(0, 100f * Time.deltaTime, 0, Space.Self);                                            
                if(instantiatedCoins[i].transform.position.z <= -27.5f){ 
                    Destroy(instantiatedCoins[i]); // This destroys the GameObject and removes it from the array if it passes behind the camera.
                    instantiatedCoins.RemoveAt(i);
                }
            }
            
            
            int oneInSix = UnityEngine.Random.Range(0,6);
            
            if(instantiatedObstacles.Count < 16){           // Instantiates a new block every time one is removed from the array.
                GameObject temp = Instantiate(availableObstacles[randomNumber()], new Vector3(randomFloat(), 0, instantiatedObstacles[14].transform.position.z + 13.75f), Quaternion.identity);
                temp.transform.SetParent(obstacles.transform, false);                                                                         
                instantiatedObstacles.Add(temp);
                if(oneInSix == 1){  // 1 in 6 chance of coins being spawned every time a new block is spawned
                    GameObject tempCoin1 = Instantiate(coin, new Vector3(randomFloat(), -.6f, temp.transform.position.z), Quaternion.identity);
                    tempCoin1.transform.SetParent(childCoins.transform, false);
                    instantiatedCoins.Add(tempCoin1);
                    for(int i = 1; i < 4; i++){
                        GameObject tempCoin2 = Instantiate(coin, new Vector3(tempCoin1.transform.position.x - 5f, -.6f, temp.transform.position.z + (i * 2)), Quaternion.identity);
                        tempCoin2.transform.SetParent(childCoins.transform, false);
                        instantiatedCoins.Add(tempCoin2);
                    }
                }
            }
        }
    }

    private float randomFloat(){
        int temp = UnityEngine.Random.Range(0,3);
        while(temp == generatedLast){
            temp = UnityEngine.Random.Range(0,3);
        }
        generatedLast = temp;
        return xSpawnCoordinates[temp];
    }



    private int randomNumber(){
        int temp = UnityEngine.Random.Range(0,13);
        while(temp == instantiatedLast){
            temp = UnityEngine.Random.Range(0,13);
        }
        instantiatedLast = temp;
        return instantiatedLast;
    }
}
