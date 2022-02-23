#include <iostream>
#include <fstream>
#include <string>

#include "classDef.h"

using namespace std;

vector<NameBasics> nameContainer; 
vector<NameBasics> matchedNContainer;

vector<TitleRatings> ratingContainer; 
vector <TitleRatings> matchedRContainer;

vector<string> nConstContainer;
vector<string> tConstContainer;  

vector<TitleBasics> titleBasicContainer;     
vector<Principals> principalContainer;


TitleRatings::TitleRatings(){}                
TitleRatings::TitleRatings(string tconst, double averageRating, int numVotes){   
    this->tconst = tconst;
    this->averageRating = averageRating;
    this->numVotes = numVotes;
}
TitleRatings::~TitleRatings(){                    
}
string TitleRatings::getTConst(){
    return tconst;
}
double TitleRatings::getAvgRating(){
    return averageRating;
}
int TitleRatings::getNumVotes(){
    return numVotes;
}



TitleBasics::TitleBasics(){} 
TitleBasics::TitleBasics(string tconst, string titleType, string primaryTitle, string originalTitle, string isAdult, string startYear, string endYear, string runtimeMinutes,  string genres){
    this->tconst = tconst;
    this->titleType = titleType;
    this->primaryTitle = primaryTitle;
    this->originalTitle = originalTitle;
    this->isAdult = isAdult;
    this->startYear = startYear;
    this->endYear = endYear;
    this->runtimeMinutes = runtimeMinutes;
    this->genres = genres;

} 
TitleBasics::~TitleBasics(){                    
}
string TitleBasics::getTConst(){
    return tconst;
}
string TitleBasics::getPTitle(){
    return primaryTitle;
}
string TitleBasics::getStartYear(){
    return startYear;
}
string TitleBasics::fixStartYear(){
    if(startYear == "\\N"){
        this->startYear = "2200";
    }
}
string TitleBasics::getGenres(){
    return genres;
}



NameBasics::NameBasics(){}
NameBasics::NameBasics(string nconst, string primaryName, string birthYear, string deathYear, string primaryProfession, string knownForTitles){   
    this->nconst = nconst;
    this->primaryName = primaryName;
    this->birthYear = birthYear;
    this->deathYear = deathYear;
    this->primaryProfession = primaryProfession;
    this->knownForTitles = knownForTitles;
}
NameBasics::~NameBasics(){
}
string NameBasics::getknownForTitles(){
    return knownForTitles;
}
string NameBasics::getName(){
    return primaryName;
}
string NameBasics::getBirthYear(){
    return birthYear;
}
string NameBasics::getPrimaryProfession(){
    return primaryProfession;
}
string NameBasics::getNConst(){
    return nconst;
}



Principals::Principals(){};
Principals::Principals(string tconst, int ordering, string nconst, string category, string job, string characters){
    this->tconst = tconst;
    this->ordering = ordering;
    this->nconst = nconst;
    this->category = category;
    this->job = job;
    this->characters = characters;
}
Principals::~Principals(){
}
string Principals::getTConst(){
    return tconst;
}
string Principals::getCategory(){
    return category;
}
string Principals::getNConst(){
    return nconst;
}
string Principals::getCharacters(){
    return characters;
}
int Principals::getOrdering(){
    return ordering;
}

