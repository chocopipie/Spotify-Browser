import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    let promise = this.http.get(this.expressBaseUrl+endpoint).toPromise();
    return Promise.resolve(promise);
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    // ref: https://www.freecodecamp.org/news/javascript-url-encode-example-how-to-use-encodeuricomponent-and-encodeuri/#:~:text=encodeURIComponent%20should%20be%20used%20to,URI%20or%20an%20existing%20URL.
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    let resourcesArray:ResourceData[] = [];
    return this.sendRequestToExpress(`/search/${category}/${encodeURIComponent(resource)}`).then(data => {
      if (data){
        console.log("data received");
      } else {
        console.log("no data received");
      }

      if (category === 'artist') {
        let resourcesArray:ArtistData[];
        resourcesArray = data.artists.items.map((artist) => new ArtistData(artist))
        if (resourcesArray) {
          console.log("Artists found")
        } else {
          console.log("No artists found.")
        }
        return resourcesArray;
      } else if (category === 'album') {
        let resourcesArray:AlbumData[];
        resourcesArray = data.albums.items.map((album) => new AlbumData(album))
        if (resourcesArray) {
          console.log("Albums found")
        } else {
          console.log("No albums found.")
        }
        //console.log(resourcesArray)
        return resourcesArray;
      } else if (category === 'track') {
        let resourcesArray:TrackData[];
        resourcesArray = data.tracks.items.map((track) => new TrackData(track))
        if (resourcesArray) {
          console.log("Tracks found")
        } else {
          console.log("No tracks found.")
        }
        //console.log(resourcesArray)
        return resourcesArray;
      }
      return resourcesArray;
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress(`/artist/${artistId}`).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    return this.sendRequestToExpress(`/artist-related-artists/${artistId}`).then((data) => {
      let relatedArtist: ArtistData[];
      relatedArtist = data.artists.map(artist => {
        return new ArtistData(artist);
      })
      if (relatedArtist) console.log("Found related artist.")
      else console.log("No related artists found.")
      //console.log(relatedArtist)
      return relatedArtist;
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress(`/artist-top-tracks/${artistId}`).then((data) => {
      let topTrack: TrackData[];
      topTrack = data.tracks.map(track => new TrackData(track));
      return topTrack;
    })
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress(`/artist-albums/${artistId}`).then((data) => {
      let artistAlbum: AlbumData[];
      artistAlbum = data.items.map(album => new AlbumData(album));
      return artistAlbum;
    })
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress(`/album/${albumId}`).then((data) => {
      return new AlbumData(data)
    })
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return this.sendRequestToExpress(`/album-tracks/${albumId}`).then((data) => {
      let tracks: TrackData[];
      tracks = data.items.map(track => new TrackData(track));
      return tracks;
    })
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress(`/track/${trackId}`).then((data) => {
      return new TrackData(data)
    })
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress(`/track-audio-features/${trackId}`).then((data) => {
      let featureList = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];
      let trackFeature: TrackFeature[] = [];
      let feature: TrackFeature;
      Object.keys(data).forEach(key => {
        if (featureList.includes(key)) {
          feature = new TrackFeature(key, data[key]);
          trackFeature.push(feature);
        }
      })
      return trackFeature
    })
  }
}
