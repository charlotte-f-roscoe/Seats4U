Inside this directory there is a folder 'nodejs' which must have this exact name.

Inside this directory you will find a db_access.js file that you must modify to contain
the credentials for YOUR RDS that you've created.

To package up the layer, simply zip this entire 'nodejs' folder (to create a file nodejs.zip) which is the 
file that you would upload from within the AWS / Lambda / Layers functionality.

When you add the layer to AWS, be sure to choose:

  * compatible architectures (x86_64)
  * compatible runtimes (Node.js 16.x)

While these are optional, I've not tried this sequence without determining these values.

Then upload the nodejs.zip file and you have created a layer (which starts with version 1).
If you ever have to edit this layer in the future, a new version would be created (successive integer
version numbers).



