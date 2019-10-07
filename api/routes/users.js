const router = require("express").Router();
const shortId = require('shortid');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const requestAuthentication = require("../utils/isAuthenticated");

// Multer Set-Up
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, `${shortId.generate()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

const alert = {
    alertMessages: [],
    alertFor: null
}

router.route("/:userID")
  .get(async (request, response) => {
    const authenticatedUser = await requestAuthentication(request.headers.authorization);

    if(authenticatedUser){
      User.findById(authenticatedUser).then(result => {
        const user = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          username: result.username,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          reviews: result.reviews,
          recentlyVisited: result.recentlyVisited,
          recentActivity: result.recentActivity,
          genres: result.genres,
          viewed: result.viewed,
          favourites: result.favourites,
          watchlist: result.watchlist,
          profilePicture: {
            publicID: result.profilePicture.publicID,
            secureURL: result.profilePicture.secureURL
          }
        };

        const token = jwt.sign({ id: authenticatedUser }, secret, {
          expiresIn: '8h'
        });

        response.status(200).send({ token, user });
      }).catch(() => {
        response.sendStatus(500);
      })
    }else {
      response.sendStatus(401);
    }
  })
;

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
          recentlyVisited: user.recentlyVisited,
          reviews: user.reviews
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

//UPDATE PROFILE PICTURE
router.post("/profile-picture", upload.single('file'), async (req, res) => {
  const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);

  if(req.file && userJWT){
    cloudinary.uploader.upload(req.file.path, {width: 200, height: 200, crop: "fill"})
    .then(response => {
      User.findOneAndUpdate({
        _id: userJWT.id
        },{
          profilePicture: {
            publicID: response.public_id,
            secureURL: response.secure_url
          }
        },{
          runValidators: true,
          new: true
        }
      ).then( user => {
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
    
        alert.alertMessages = [`Profile picture successfully updated!`];
        alert.alertFor = "updateUserProfile";

        unlinkAsync(req.file.path);
    
        res.status(200).send({ token, updatedUser, alert });
      }).catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
    
        res.status(403).send({ alert });
      })
    }).catch(err => {
      console.log(err);
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