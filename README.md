# oneDay

Recommandation:
 NodeJS version - v14.16.0.

Tutorial:
1. For start you have to clone the repository on your computer
 -> git clone https://github.com/PlopeanuOana/oneDay.git

2. Position yourself in the cloned file

3. Next install al the dependencies
 -> npm install

4. Generate a new token for authentication
 -> go to https://github.com/settings/tokens/new?scopes=repo
 -> select all the scopes and give it to octokit const at line 7.

 !!!!If you don't do this, the search will generate an error:
    ->message: bad reguest
    ->status: 401

4. Next to start the application you run:
 ->npm start


 Further enhancements : 
 1. Open a new page for gists contents and display it with a design 
 2. Add a page pagination for design.

 Further optimizations :
 1. Validate input for search

