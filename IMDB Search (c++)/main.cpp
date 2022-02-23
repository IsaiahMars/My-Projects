// Eugene Ayotte, Nanami Yasuda, Isaiah Mars

#include <iostream>
#include <iomanip>
#include <fstream>
#include <string>
#include <vector>
#include <cassert>
#include <algorithm>
#include <cmath>

#include "funcDef.h"

vector<string> parser(string s, string delimiter){                      
    size_t start = 0, end, delim_len = delimiter.length();      
    string value;
    vector<string> container;
                                                                    // Declaring function "parser" to use throughout the file, this function will take a string
    while ((end = s.find (delimiter, start)) != string::npos) {     // and seperate it by a given delimiter. Then it takes those separated values and inserts them into a vector
        value = s.substr (start, end - start);                      // so that they can be accessed. 
        start = end + delim_len;
        container.push_back (value);
    }

    container.push_back (s.substr(start));
    return container;
}

void makeNameContainer(){
    ifstream in;
    string tempString;              
    in.open("SmallDataset/name.basics.tsv");                    // Declaring function "makeNameContainer", which takes in every line from name.basics as a string "tempString", 
                                                                // and then calls the parser on that string, effectively creating a vector "v" with our class attributes inside.
    while(getline(in, tempString) && !in.eof()){                // Then, an instance of NameBasics is created based on the elements of "v" and added to the end of a vector "nameContainer". 
        vector<string> v = parser(tempString, "\t");            
        NameBasics aName(v[0], v[1], v[2], v[3], v[4], v[5]);
        nameContainer.push_back(aName);
    }
}

void makeRatingContainer(){
    ifstream in;
    string tempString;
    in.open("SmallDataset/title.ratings.tsv");
    
    while(getline(in, tempString) && !in.eof()){                // Declaring function "makeRatingContainer", which takes in every line from name.basics as a string "tempString", 
        vector<string> v = parser(tempString, "\t");            // and then calls the parser on that string, effectively creating a vector "v" with our class attributes inside.
        TitleRatings aRating(v[0], stod(v[1]), stoi(v[2]));     // Then, an instance of TitleRatings is created based on the elements of "v" and added to the end of a vector "ratingContainer".
        ratingContainer.push_back(aRating);  
    }
}

void checkTitleBasics(){
    ifstream in;
    string tempString;
    in.open("SmallDataset/title.basics.tsv");
    
    while(getline(in, tempString) && !in.eof()){                                             // Declaring function "checkTitleBasics()", which takes in every line from title.basics as a string "tempString",
        vector<string> v = parser(tempString, "\t");                                         // and then calls the parser on that string, effectively creating a vector "v" with our class attributes inside.
        TitleBasics aTitleBasic(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);       // Then, an instance of TitleBasics is created based on the elements of "v". That instance's tconst value is then checked
                                                                                             // against a vector "tConstContainer", which is a vector that has been created by using the parser on the class method "getKnownForTitles()".
        if(count(tConstContainer.begin(), tConstContainer.end(), aTitleBasic.getTConst())){  // If the instance's tconst value matches one in the tConstContainer, the instance is added to titleBasicContainer.
            titleBasicContainer.push_back(aTitleBasic);                                      // Additionally, if the number of elements in titleBasicContainer matches the number of elements in matchedRContainer, the while loop 
            cout << ".";                                                                     // is broken to save time. 
            }
        if(titleBasicContainer.size() == matchedRContainer.size()){
            break;
        }
    }
}

void checkPrincipals(){
    ifstream in;
    string tempString;
    in.open("SmallDataset/title.principals.tsv");   
               
    while(getline(in, tempString) && !in.eof()){
        vector<string> v = parser(tempString, "\t");
        
        Principals aPrincipal(v[0], stoi(v[1]), v[2], v[3], v[4], v[5]);    
        
        if(count(nConstContainer.begin(), nConstContainer.end(), aPrincipal.getNConst()) && count(tConstContainer.begin(), tConstContainer.end(), aPrincipal.getTConst())){
            principalContainer.push_back(aPrincipal);  
            cout << ".";                                                                    // Declaring function "checkPrincipals()", which takes in every line from title.principals as a string "tempString",
        }                                                                                   // and then calls the parser on that string, effectively creating a vector "v" with our class attributes inside.
        if(principalContainer.size() == titleBasicContainer.size()){                        // Then, an instance of Principals is created based on the elements of "v". That instance's tconst and nconst value is then checked
            cout << " Done!\n";                                                             // against the vectors "tConstContainer" and "nConstContainer", which are vectors that hold our found nconst and tconst values. 
            break;                                                                          // Additionally, if the number of elements in principalContainer matches the number of elements in TitleBasicContainer, the while loop                                         
        }                                                                                   // is broken to save time and "Done!" is output in the terminal to display that the program is done searching.
                                                                                            
    }                                                                                       
}

double calculateMovieScore(TitleRatings& aRating){                                          // Declaring function "calculateMovieScore", which takes one parameter, an instance of TitleRatings. Then, the variable "totalScore"
    double totalScore = aRating.getAvgRating() * aRating.getNumVotes();                     // is declared and assigned the value of the instance's avgRating times it's numVotes. Then, it iterates through the vector titleBasicContainer
        for(size_t i = 0; i<titleBasicContainer.size(); i++){                               // and creates and assigns an instance of TitleBasics. Next, the parser is used to create a vector "v", which contains the genres of our instance. 
            TitleBasics tempBasic = titleBasicContainer[i];                                 // Multiple if statements are then used to modify the value of totalScore based on what the instance's genres. fixStartYear() is then called on the 
            vector<string> v = parser(tempBasic.getGenres(), ",");                          // instance just in case it's start year is "\N". totalScore is then adjusted based on the formula below, and then returned. 
            if(count(v.begin(), v.end(), "Horror")){                        
                totalScore *= .6;
            }
            if(count(v.begin(), v.end(), "Romance")){
                totalScore *= .7;
            }
            if(count(v.begin(), v.end(), "Drama")){
                totalScore *= 1.5;
            }
            if(count(v.begin(), v.end(), "Comedy")){
                totalScore *= 1.25;
            }
            tempBasic.fixStartYear();
            double tempScore = totalScore;
            totalScore = tempScore * (150 - (2021 - stoi(tempBasic.getStartYear())))/150;
            return totalScore;
        }
       
}

void displayInfo(string first, string last){
    cout << "\nResults found for " << first << " " << last << ":\n";
    cout << "\tAbout " << first << " " << last << ":\n";
    cout << "\t\t" << "Born: " << matchedNContainer[0].getBirthYear() << endl;
    cout << "\t\t" << "Occupation: " << matchedNContainer[0].getPrimaryProfession() << endl;
    
    cout << "\n\tKnown For:";                                                                       // This function simply takes all of the data we stored within our vectors
    for(size_t i = 0; i<titleBasicContainer.size(); i++){                                           // and outputs it in the terminal in a nice format. 
        cout << "\n______________________________________\n" << endl;
        cout << "\t\t" << titleBasicContainer[i].getPTitle() << ", " << titleBasicContainer[i].getStartYear() << ".\n";
        cout << "\t\tCharacter Name: " << principalContainer[i].getCharacters() << endl;                                    
        cout << "\t\tAverage Rating = " << setprecision(2) << matchedRContainer[i].getAvgRating() << "/10, out of " << matchedRContainer[i].getNumVotes() << " votes." << endl;
        cout << "\t\tTagged As: " << titleBasicContainer[i].getGenres() << ".\n";
        cout << "\n\t\tMovie Score = " << fixed << setprecision(0) << calculateMovieScore(matchedRContainer[i]) << endl;
        }
    cout << "\n______________________________________\n";
}

int main(){
        int usrResponse;
        string firstName;
        string lastName;
        cout << "Would you like to search for someone on IMDB?\n 1) Yes\n 2) No\n";
        cin >> usrResponse;
        switch(usrResponse){
            case 1:
                cout << "\nPlease enter the person's name:\t";
                cin >> firstName >> lastName;
                makeNameContainer();                                            // Calling makeNameContainer to create a vector containing every instance of NameBasics contained within name.basics
                cout << "\nLoading...";
                for (size_t i = 0; i < nameContainer.size(); ++i){              // Iterating through nameContainer
                    NameBasics temp = nameContainer[i];                         // Creating an instance of NameBasics based on the iterator's position
                    if (temp.getName() == firstName + " " + lastName){          // If getName returns a name matching the one that the user searched for, it adds that instance and its nconst value to the vectors matchedNContainer and nConstContainer.
                        nConstContainer.push_back(temp.getNConst());
                        matchedNContainer.push_back(temp);
                        string knownFor = temp.getknownForTitles();                                 // Creating a string "knownFor" based on that matching instance's attribute knownForTitles
                        vector<string> vectorTConst = parser(knownFor, ",");                        // Parsing "knownFor" to a vector known as "vectorTConst" to be accessed later.
                        makeRatingContainer();                                                      // Calling makeRatingContainer to create a vector containing every instance of TitleRatings contained within title.ratings
                        for(size_t i = 0; i < ratingContainer.size(); ++i){                         // Iterating through ratingContainer
                            TitleRatings temp = ratingContainer[i];                                 // Creating an instance of TitleRatings based on the iterator's position
                            if(count(vectorTConst.begin(), vectorTConst.end(), temp.getTConst())){  // If that instance's tconst value matches a tconst value inside of vectorTConst, it adds that instance and its tconst value to the vectors matchedRContainer and tConstContainer.
                                 matchedRContainer.push_back(temp);
                                 tConstContainer.push_back(temp.getTConst());
                                 cout << ".";                                       
                            }
                        }
                    }
                }
                checkTitleBasics();
                checkPrincipals();
                
                displayInfo(firstName, lastName);
                
                break;
            case 2:
                cout << "Goodbye." << endl;
                break;
            default:
                cout << "Sorry, can't help with that one." << endl;
        }
}