using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class MovementHandler : MonoBehaviour
{
    public GameObject player;
    public Animator animator;
    public Rigidbody rigidBody;
    public BoxCollider topCollider;

    public AudioSource footstepsSFX;
    public AudioSource jumpSFX;
    public AudioSource strafeSFX;
    public AudioSource rollSFX;
    public AudioSource whackSFX;
    public AudioSource coinPickupSFX;
    public AudioSource backgroundMusic;

    private int rows;
    private Vector3 jumpHeight = new Vector3(0f, 2f, 0f);
    private Vector3 targetPosition = new Vector3(1.5f, 0f, 0f);
    private Vector3 tempTarget;
    private Vector3 currentPos;
    private bool whacked = false;
    private bool movingRight = false;
    private bool movingLeft = false;
    [SerializeField] bool grounded;

    void Start()
    {
        rows = 1;
    }

    
    void Update()
    {
        bool isMovingLeft = animator.GetBool("isMovingLeft");
        bool isMovingRight = animator.GetBool("isMovingRight");

        bool spacePressed = Input.GetKeyDown("space");
        bool isJumping = animator.GetBool("isJumping");

        bool sPressed = Input.GetKeyDown("s");
        bool isRolling = animator.GetBool("isRolling");

        bool gameOver = animator.GetBool("gameOver");

        if(!gameOver){
            if(Input.GetKeyDown("a") && !movingLeft && !movingRight && rows > 0){
                rows--;
                currentPos = transform.position;
                tempTarget = currentPos - targetPosition;          
                movingLeft = true;
                animator.SetBool("isMovingLeft", true);
                footstepsSFX.Pause();
                strafeSFX.Play();
            }
            if(movingLeft){
                moveLeft();
                if(transform.position == currentPos - targetPosition){
                    movingLeft = false;
                    animator.SetBool("isMovingLeft", false);
                    footstepsSFX.Play();
                    currentPos = Vector3.zero;
                }
            }
        
            if(Input.GetKeyDown("d") && !movingRight && !movingLeft && rows < 2){
                rows++;
                currentPos = transform.position;
                tempTarget = currentPos + targetPosition;
                movingRight = true;
                animator.SetBool("isMovingRight", true);
                footstepsSFX.Pause();
                strafeSFX.Play();
            }
            if(movingRight){
                moveRight();
                if(transform.position == currentPos + targetPosition){
                    movingRight = false;
                    animator.SetBool("isMovingRight", false);
                    footstepsSFX.Play();
                    currentPos = Vector3.zero;
                }
            }

        
            if(grounded && spacePressed && !isRolling && !movingLeft && !movingRight){
                rigidBody.AddForce(jumpHeight * 2.5f, ForceMode.Impulse);
                animator.SetBool("isJumping", true);                        // jump
                footstepsSFX.Pause();
                jumpSFX.Play();                                         
            }                                       
            if(isJumping && grounded){
                animator.SetBool("isJumping", false);
                footstepsSFX.Play();
            }

            if(!isRolling && grounded && sPressed){
                animator.SetBool("isRolling", true);                // roll
                topCollider.enabled = false;
                footstepsSFX.Pause();
                rollSFX.Play();
                Invoke("colliderReset", 1.3f);
            }
        }
        
        if(Input.GetKeyDown("k") && !movingRight && !movingLeft){
            animator.SetBool("gameOver", true);                       // simulated game over
            backgroundMusic.Stop();
            footstepsSFX.Stop();
            whackSFX.Play();
        }

    }

    void moveLeft(){
        transform.position = Vector3.MoveTowards(transform.position, tempTarget, 4f * Time.deltaTime); 
    }

    void moveRight(){
        transform.position = Vector3.MoveTowards(transform.position, tempTarget, 4f * Time.deltaTime);
    }

    void colliderReset(){
        topCollider.enabled = true;
        animator.SetBool("isRolling", false);
        footstepsSFX.Play();
    }

    void OnTriggerEnter(Collider other){
        if(other.transform.tag == "Obstacle"){
            animator.SetBool("gameOver", true);
            
            backgroundMusic.Stop();
            footstepsSFX.Stop();
            if(!whacked){
                whackSFX.Play();
                whacked = true;
            }
            
        }
        if(other.transform.tag == "Coin"){
            ScoreTracker.coinCount += 1;
            coinPickupSFX.Play();
            Destroy(other.gameObject);
            ObstacleGenerator.instantiatedCoins.Remove(other.gameObject);
        }
    }

    void OnTriggerStay(Collider other){
        if(other.transform.tag == "Ground"){
            grounded = true;
        }
    }

    void OnTriggerExit(Collider other){
        if(other.transform.tag == "Ground"){
            grounded = false;
        }
    }

}
