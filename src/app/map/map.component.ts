import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from '@types/googlemaps';
import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public searchplace = [];
  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private Http: HttpClient
  ) { }

  ngOnInit() {

    //set google maps defaults
    this.zoom = 4;

    //create search FormControl
    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.SearchBox(this.searchElementRef.nativeElement);

      if (navigator.geolocation) {
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          }, (err) => {
            reject(err);

          });
        })
      } else {
        alert("Geolocation is not supported by this browser.");
      }
      autocomplete.addListener("places_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = autocomplete.getPlaces();
          this.searchplace = place;
          console.log('this.searchplace', this.searchplace);
          //verify result

          if (place.length == 1) {
            this.latitude = this.searchplace[0].geometry.location.lat();
            this.longitude = this.searchplace[0].geometry.location.lng();
          }

          //set latitude, longitude and zoom

          this.zoom = 12;
          // *Note we can store these lat & long in our DB
          //after that we can get place info by geocodeLatLng method
        });
      });
    });
  }

  checkoutInMap(lat, lng) {
    this.latitude = lat;
    this.longitude = lng;
    this.zoom=15;
    window.scroll(0, 0);
  }
  //set reversecode config before set
  public setreverseGeoCode(lat, lang) {
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: parseFloat(lat), lng: parseFloat(lang) }
    });
    this.geocodeLatLng(geocoder, map, lat, lang, infowindow);
  };

  //set reverse geo location on demand
  geocodeLatLng(geocoder, map, latitude, longitude, infowindow) {
    var latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          //we get values of reverse geo code here
          map.setZoom(11);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
}
