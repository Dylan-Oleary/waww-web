const router = require("express").Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Movie = require('../models/movie');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;

const alert = {
  alertMessages: [],
  alertFor: null
}

router.post("/", (req, res) => {
  User.findOne({
    $or: [
      {"username": req.body.newUser.username},
      {"email": req.body.newUser.email}
    ]
  })
  .then( user => {
    //Check if any user credentials exist in the DB, if they do inform the user trying to register
    if(user){
      alert.alertMessages = [];
      
      if(user.username === req.body.newUser.username){
        alert.alertMessages.push("A user with this user name already exists!");
        alert.alertFor = "existingCredentials";
      }
      if(user.email === req.body.newUser.email){
        alert.alertMessages.push("A user with this email already exists!");
        alert.alertFor = "existingCredentials";
      }

      res.status(409).send({ alert });
    } else{
      //Create the user, if all required credentials are unique
      User.create({
        firstName: req.body.newUser.firstName,
        lastName: req.body.newUser.lastName,
        email: req.body.newUser.email,
        username: req.body.newUser.username,
        password: req.body.newUser.password,
        confirmPassword: req.body.newUser.confirmPassword,
        watchlist: [],
        favourites: [],
        genres: [],
        profilePicture: {
            contentType: null,
            data: null
        }
      })
      .then( user => {
          res.send(user);
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(500).send({ alert });
      })
    }
  })
  .catch(() => {
    alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
    alert.alertFor = "DB ERROR"

    res.status(502).send({ alert });
  })
});

router.get("/", async (req, res) => {
  const userJWT = jwt.verify(req.query.jwt, process.env.TOKEN_SECRET);
  
  User.findOne({
      _id: userJWT.id
  })
  .then( user => {
      const authenticatedUser = {
          profilePicture: user.profilePicture,
          watchlist: user.watchlist,
          favourites: user.favourites,
          viewed: user.viewed,
          ratedList: user.ratedList,
          genres: user.genres,
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          recentActivity: user.recentActivity,
          recentlyVisited: user.recentlyVisited
      }

      res.status(200).send({ authenticatedUser });
  })
  .catch( () => {
      alert.alertMessages = ["Please login to view this content"];
      alert.alertFor = "nullJWT";

      res.status(409).send({ alert });
  })
})

//UPDATE QUEUE
router.post("/watchlist", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in Watch List - if it doesn't add it, if it does remove it
    const watchListMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.watchlist.length; i++){
                if(user.watchlist[i]._id === movie._id){
                    return user.watchlist[i];
                }
            }
        })
        .catch(() => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!watchListMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          watchlist: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your backlog`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your WatchList!`];
        alert.alertFor = "addToWatchList"

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(502).send({ alert });
      })
    } else {
      //If it is on the Watch List, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          watchlist: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title
          }
        },
        $push : {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your backlog`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully removed to your WatchList!`];
        alert.alertFor = "removeFromWatchList";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(502).send({ alert });
      })
    }
  }
});

//UPDATE FAVOURITES
router.post("/favourites", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in Watch List - if it doesn't add it, if it does remove it
    const favouriteMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.favourites.length; i++){
                if(user.favourites[i]._id === movie._id){
                    return user.favourites[i];
                }
            }
        })
        .catch(err => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!favouriteMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          favourites: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your favourites`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
      }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your Favourites!`];
        alert.alertFor = "addToFavourites";

        res.status(200).send({ alert });
      })
      .catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    } else {
      //If it is in Favourites, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          favourites: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
          }
        },
        $push : {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your favourites`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then( () => {
        alert.alertMessages = [`${movie.title} has been successfully removed from your Favourites!`];
        alert.alertFor = "removeFromFavourites";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    }
  }
});

//UPDATE LOG
router.post("/viewed", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in ViewedList - if it doesn't add it, if it does remove it
    const viewedMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.viewed.length; i++){
                if(user.viewed[i]._id === movie._id){
                    return user.viewed[i];
                }
            }
        })
        .catch(err => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!viewedMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          viewed: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your log`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
      }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your ViewedList!`];
        alert.alertFor = "addToViewed";

        res.status(200).send({ alert });
      })
      .catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    } else {
      //If it is in Viewed, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          viewed: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
          }
        },
        $push: {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your log`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then( () => {
        alert.alertMessages = [`${movie.title} has been successfully removed from your ViewedList!`];
        alert.alertFor = "removeFromViewed";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    }
  }
})

//UPDATE USER
router.post("/update", async (req, res) => {
    //If no JWT, send alert message
    if(req.body.jwt === null ){
      alert.alertMessages = ["You must log in before updating your profile!"];
      alert.alertFor = "nullJWT";
  
      res.status(401).send({ alert });
    } else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    
		User.findOneAndUpdate({
			"_id": userJWT.id
    }, req.body.formValues, {
      runValidators: true,
      new: true
    })
		.then( user => {	
			const payload = { 
				id: user.id
      };

      const token = jwt.sign(payload, secret, {
			  expiresIn: '8h'
			});

      const updatedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profilePicture: user.profilePicture,
        watchlist: user.watchlist,
        favourites: user.favourites,
        viewed: user.viewed,
        genres: user.genres,
        recentActivity: user.recentActivity,
        recentlyVisited: user.recentlyVisited
      }

      alert.alertMessages = [`Profile successfully updated!`];
      alert.alertFor = "updateUserProfile";
	
			res.status(200).send({ token, updatedUser, alert });
		})
		.catch(() => {
      alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
      alert.alertFor = "DB ERROR"

      res.status(403).send({ alert });
		})
    }
});

//DELETE USER
router.post("/delete", async (req, res) => {
    //If no JWT, send alert message
    if(req.body.jwt === null ){
      alert.alertMessages = ["You must log in before updating your profile!"];
      alert.alertFor = "nullJWT";
  
      res.status(401).send({ alert });
    } else {
      const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);

      User.deleteOne({
        "_id": userJWT.id
      })
      .then(() => {
        alert.alertMessages = [`Account successfully deleted!`];
        alert.alertFor = "deleteAccount";
    
        res.status(200).send({ alert });
      })
      .catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    }
});

module.exports = router;