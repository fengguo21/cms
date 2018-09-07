/*/**
 * httpserver
 * @authors DEAN hxj (xxxxxxx@delibal)
 * @date    2018-05-30 17:41:15
 * @version $Id$
 */
'use strict';
import Vue from 'vue';
var axios = require('axios')
/*axios.defaults.baseURL='http://192.168.1.142';
*/
var httpService = new Vue({
    data: {
       urlCommon:''
    },
    methods: {
         commonAxiosPost:function(url,data){
          console.log("kkkkk",url,data)
          let time = Date.parse(new Date());
          let sid = Math.random().toString(36).substr(2);
          let sign = Math.random().toString(35).substr(2);
          const apiUrl=  url;
          return new Promise(function(resolve, reject) {
            axios.post(apiUrl, data, {
                      headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'version': 1.0 ,
                            'devices': 'cms',
                            'model': 'pc',
                            'sid': sid,
                            'time': time,
                            'sign': sign

                      }
                  })
                  .then(function (response) {
                    console.log(response);
                    resolve(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                    reject(error);
                  });
          });
      },


  }
})

export default httpService;
