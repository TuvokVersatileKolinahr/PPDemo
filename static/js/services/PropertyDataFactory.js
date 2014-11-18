// the $http API is based on the deferred/promise APIs exposed by the $q service
// so it returns a promise for us by default
app.factory('PropertyData', function($http, $q, config, propertyCache) {
  /**
   * Workaround for images in EE without Webdav configured. Fixes the reference as stored in EE to a file url.
   * 
   * This method assumes two things:
   * - the file is stored in "{PATH_TO_TOMCAT}webapps\static\buildings\filename.jpg"
   * - the file is accessible under url "/static/buildings/filename.jpg"
   * 
   * @param String ref to the EE image path
   * 
   * @return String file url
   */
  function _fixPhotoRef(ref) {
    var imgurl = '/static/buildings/no_image.jpg';
    if (ref)
      imgurl = ref.split('webapps')[1].replace(/\\/g, '/');

    if (config.localdev)
      imgurl = imgurl.slice(1);

    return imgurl;
  }

  //return a reference to the the PropertyData function
  return{
    getProperties: function() {

      /**
       * Fetch the data from an external source if there is no cache version or if the cache is overdue
       */
      var propCache = propertyCache.get('properties.list');
      var propertiesList;

      if (propCache && (Date.now() - propertyCache.get('properties.ts') < config.cache_refresh )) {
        //we have a cached version of the properties & cache is less than 'config.cache_refresh' old
        console.log("Return from cache");
        if (config.localdev) {
          //indicate that the cache is still valid
          propertyCache.put('properties.ts', Date.now());
        }
        // return the promise
        return $q.when(propCache);
      } else { //we need to fetch the properties
        if (config.localdev) {
          propertiesList = $http.get('static/js/mock-nijmegen.js');
        } else {
          propertiesList = $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodGetList});
        }
      }

      // When our $http promise resolves
      return propertiesList.then(function(response) {
          if (typeof response.data === 'object') {
            var propertiesList = response.data;
            for(var i=0; i < propertiesList.result.length; i++) {
              propertiesList.result[i].photoref = _fixPhotoRef(propertiesList.result[i].photoref);
            }

            //update the cache
            propertyCache.put('properties.list', propertiesList)
            propertyCache.put('properties.ts', Date.now())
            return propertiesList;
          } else {
            // invalid response
            return $q.reject(response.data);
          }
        }, function(response) {
          // something went wrong
          return $q.reject(response.data);
      });
    },
    getProperty: function(code) {
      var propCache = propertyCache.get('properties.list');
      var retval;
      for(var i=0; i < propCache.result.length; i++) {
        var p = propCache.result[i];
        if (p.code === code){
          // save this item as the selected one
          p.selected = true;
          retval = p;
        } else {
          //make sure selected is false
          p.selected = false;
        }
        // and put the 'enhanced version' back in the cache for later use
        propCache.result[i] = p;
      }
      propertyCache.put('properties.list', propCache);
      // return the promise
      return $q.all(retval);
    },
    updateProperty: function(id, property) {
      //Added a 'cast to string' in order to get the webservice interface right
      saveObject = {
        "areabuilton":      ""+property.areabuilton,
        "cadastralArea":    ""+property.cadastralArea,
        "cadastralNumbers": ""+property.cadastralNumbers,
        "groundrent":       ""+property.groundrent,
        "name":             property.name
      }
      var arguments = [id, JSON.stringify(saveObject)];

        if (config.localdev) {
          // mock success response
          response = {
            data: {
              result: []
            }
          };
          //return the promise
          return $q.all(response.data);
        } else {
          return $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodSave, args: arguments}).
            then(function(response) {
              if (typeof response.data === 'object') {
                propertyCache.put('properties.list', response.data.result);
                //after succesfull change a cacherefresh is due
                propertyCache.put('properties.ts', 0);
                return response.data;
              } else {
                // invalid response
                return $q.reject(response.data);
              }
            }, function(response) {
              // something went wrong
              return $q.reject(response.data);
            });
        }
    }

  };
});

