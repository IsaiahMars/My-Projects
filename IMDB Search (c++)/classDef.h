#include <iostream>
#include <string>
#include <vector>
#include <cassert>

using namespace std;

class TitleRatings{
    private:
        string tconst;
        double averageRating;
        int numVotes;
    protected:
    public:
        TitleRatings();
        TitleRatings(string tconst, double averageRating, int numVotes);
        ~TitleRatings();
        string getTConst();
        double getAvgRating();
        int getNumVotes();       
};

class TitleBasics{     
    private:
        string tconst;
        string titleType;
        string primaryTitle;
        string originalTitle;
        string isAdult;
        string startYear;
        string endYear;
        string runtimeMinutes; 
        string genres;
    protected:
    public:
        TitleBasics();
        TitleBasics(string tconst, string titleType, string primaryTitle, string originalTitle, string isAdult, string startYear, string endYear, string runtimeMinutes, string genres);
        ~TitleBasics();
        string getTConst();
        string getPTitle();
        string getStartYear();
        string fixStartYear();
        string getGenres();     
};

class NameBasics{
    private:
        string nconst;
        string primaryName;
        string birthYear;
        string deathYear;
        string primaryProfession;
        string knownForTitles;
    protected:
    public:
        NameBasics();
        NameBasics(string nconst, string primaryName, string birthYear, string deathYear, string primaryProfession, string knownForTitles);
        ~NameBasics();
        string getName();
        string getBirthYear();
        string getknownForTitles();
        string getPrimaryProfession();
        string getNConst();      
};

class Principals{
    private:
        string tconst;
        int ordering;
        string nconst;
        string category;
        string job;
        string characters; 
    protected:
    public:
        Principals();
        Principals(string tconst, int ordering, string nconst, string category, string job, string characters);
        ~Principals();
        string getTConst();
        string getCategory();
        string getNConst();
        string getCharacters();
        int getOrdering();
};
