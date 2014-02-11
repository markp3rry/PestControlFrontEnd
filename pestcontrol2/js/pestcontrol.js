var model;

function getIEVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.test(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    }

    function checkVersion() {
        var ver = getIEVersion();

        if ( ver != -1 ) {
            if (ver <= 9.0) {
                // do something
                window.location.href = "browser.html";
            }
        }
    }


var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

 function getQuery(key){
        var temp = location.search.match(new RegExp(key + "=(.*?)($|\&)", "i"));
        if(!temp) {
          return;
        }
        else{
         return temp[1];
      }
    }
//pass in date, get back friendly date string
  function friendlyDate(d){
    var theDate;
    if (d.getDate() == 1){
              theDate = "1st";
            }
            else if (d.getDate() == 2){
              theDate = "2nd";
            }
            else if (d.getDate() == 3){
              theDate = "3rd";
            }
            else if (d.getDate() == 22){
              theDate = "22nd"
            }
            else if (d.getDate() == 23){
              theDate = "23rd";
            }
            else if (d.getDate() == 24){
              theDate = "24th";
            }
            else if (d.getDate() >= 25 && d.getDate() <= 30){
              theDate = d.getDate() + "th";
            }
            else if (d.getDate() == 31){
              theDate = "31st";
            }
            else{
              theDate = d.getDate() + "th";
            }
            return theDate;
  }

  //DOCUMENT.READY
  $(document).ready(function(){
    //checkVersion();
    model = new ViewModel();
    ko.applyBindings(model)
    // if (getQuery('target')){
    //   if (getQuery('target') == "login"){
    //     model.showSignIn();
    //   }
    // }
    //console.log($('#newBookingAddressSelect'));
  });

  //EVENT HANDLER FOR CHANGING THE PEST TYPE 
  $('#newBookingTypeOfPest').change(function(){
    
  })

  //EVENT HANDLER FOR SELECTING AN ADDRESS FROM THE LIST WHEN MAKING A NEW BOOKING
  $('#newBookingAddressSelect').on('change', function(){
    console.log('test');
    for (var i = 0; i < model.newBookingAddressList().length; i++){
      if (model.newBookingAddressList()[i].uprn == $('#newBookingAddressSelect').val()){
        model.newBookingAddressLine1(model.newBookingAddressList()[i].address);
        model.newBookingTown(model.newBookingAddressList()[i].town);
        //add the selected UPRN to the booking model for Geo processing later
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      booking.UPRN = model.newBookingAddressList()[i].uprn;
      sessionStorage.booking = JSON.stringify(booking);
      }
    }
    model.newBookingAddressDetailsAreVisible(true);
  })

  //EVENT HANDLER FOR SPECIFIC APPOINTMENT BUTTONS
  $('.appt').click(function(){
    var booking = JSON.parse(sessionStorage.getItem('booking'));
    booking.BookedDate = model.newBookingAppointments()[$(this).attr('id').substring(4)];
    sessionStorage.booking = JSON.stringify(booking);
    model.newBookingPage6(false);
    model.newBookingPage4(true);
  });

  //CUSTOM FORM VALIDATORS FOR JQUERY.VALIDATION LIBRARY
  // $.validator.addMethod("pwcheck", function(value) {
  //   return /^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z]).*$/.test(value) // consists of only these
  //   }, "Min 6 chars, 1 upper and 1 lower case");
  // $.validator.addMethod("ukpostcodecheck", function(value) {
  //   return /^([A-Za-z][A-Za-z0-9]?[A-Za-z0-9]?[A-Za-z0-9]? {1,2}[0-9][A-Za-z0-9]{2})$/.test(value) // consists of only these
  //   }, "Invalid postcode");

  //FORM VALIDATION FOR PAGE 1 OF NEW BOOKING FORM
  $('#frmNewBookingPage1').submit(function(e){
    if ($(this).valid()){
      model.newBookingPage1Page2();
    }
    return false;
  });
  // $('#frmNewBookingPage1').validate({
  //   rules:{
  //     firstname: {
  //       required: true
  //     },
  //     lastname: {
  //       required: true
  //     },
  //     addrline1: {
  //       required: true
  //     },
  //     town: {
  //       required: true
  //     },
  //     postcode: {
  //       required: true,
  //       ukpostcodecheck: true
  //     }
  //   }
  // });

  //FORM VALIDATION FOR PAGE 2 OF NEW BOOKING FORM
  $('#frmNewBookingPage2').submit(function(e){
    if($(this).valid()){
      model.newBookingPage2Page3();
    }
    return false;  
  });

  //FORM VALIDATION FOR LOGIN FORM
  // $('#loginFrm').on('submit', function(){
    
    
  // });
  $('#loginFrm').validate({
    rules:{
      email: {
        required: true
      },
      password: {
        required: true
      }
    }
  })

  //FORM VALIDATION FOR CREATE NEW ACCOUNT
  $('#tst').submit(function(e){
    if ($(this).valid()){
      $.ajax({
        url: url() + 'booking/createnewuseraccount',
        type: 'POST',
        data: $('#tst').serialize(),
        success: function(){
          model.showNewBooking();    
        }
      })
    }
    return false;
  })
  $('#tst').validate({
      rules:{
        password: {
          pwcheck: true,
          required: true
        },
        email:{
          required: true,
          email: true,
           remote: {
             url: url() + 'booking/duplicateemail',
             type: 'GET',
             async: false
           }
        },
        firstname: {
          required: true
        },
        lastname: {
          required: true
        }
      }
    });

  //FORM VALIDATION FOR RESET PASSWORD
  $('#passwordResetFrm').submit(function(e){
     if ($(this).valid()){
      model.passwordResetSpinner(true);
      var email = model.passwordResetUsername();
       $.ajax({
         url: url() + 'booking/startpasswordreset',
         type: 'POST',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         data: JSON.stringify({"EmailAddress": email}),
         success: function(response){
           if (response == true)
           {
             model.passwordResetOK(true);
             model.passwordResetError(false);
           }
           else
           {
             model.passwordResetError(true);
             model.passwordResetOK(false);
           }
         },
         complete: function(){
          model.passwordResetSpinner(false);
         }
       });
     }
    return false;
  })
  // $('#passwordResetFrm').validate({
  //     rules:{
  //       email:{
  //         required: true,
  //         email: true
  //       }
  //     }
  //   });

  //FORM VALIDATION FOR PICK NEW PASSWORD
  $('#newPasswordFrm').submit(function(e){
    if ($(this).valid()){
       $.ajax({
         url: url() + 'booking/finishpasswordreset',
         type: 'POST',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         data: JSON.stringify({EmailAddress: getQuery('email'), Hash: getQuery('kwyjibo'), Password: model.loginPassword()}),
         success: function(response){
           if (response == true){
            model.resetForm(false);
            model.resetConfirmation(true);
           }   
         }
       })
      // sessionStorage.setItem('email', getQuery('email'));
      // console.log(sessionStorage.email);
      // window.location.href = "index.html";
      
    }
    return false;
  })
  // $('#newPasswordFrm').validate({
  //     rules:{
  //       pwNew:{
  //         required: true,
  //         pwcheck: true
  //       },
  //       pwConfirm: {
  //         required: true,
  //         pwcheck: true,
  //         equalTo: "#pwNew"
  //       }
  //     }
  //   });

  function ViewModel(){
    var self = this;

    self.loggedInNav = ko.observable(false);
    self.loggedOutNav = ko.observable(true);

    //sign in email address
    self.signInEmail = ko.observable();
    self.customerID = ko.observable();
    self.notSignedIn = ko.observable(true);
    self.signedIn = ko.observable(false);
    //home content
    self.homeContent = ko.observable(true);
    //sign in content
    self.signInContent = ko.observable(false);
    //bookingsContent
    self.bookingsContent = ko.observable(false);
    //new booking content
    self.newBookingContent = ko.observable(false);
    //register content
    self.registerContent = ko.observable(false);
    //contact form content
    self.contactFormContent = ko.observable(false);
    self.contactFormContentForm = ko.observable(true);
    self.contactFormContentMessage = ko.observable(false);
    //portal content
    self.portalContent = ko.observable(false);
    //flag to tell the app which page to go to next when the user has signed in
    self.whereToNext = ko.observable();

    self.contractStartDate = ko.observable();
    self.contractEndDate = ko.observable();
    self.contractFee = ko.observable();

    //password reset content
    self.passwordResetContent = ko.observable(false);
    self.passwordResetUsername = ko.observable();
    self.passwordResetError = ko.observable(false);
    self.passwordResetOK = ko.observable(false);
    self.resetForm = ko.observable(true);
    self.resetConfirmation = ko.observable(false);
    self.passwordResetSpinner = ko.observable(false);
    self.resetLogIn = function(){
      //sessionStorage.setItem('email', getQuery('email'));
      // console.log(sessionStorage.email);
      window.location.href = "index.html?target=login";
    }

    //values for page 1
    self.newBookingFirstName = ko.observable();
    self.newBookingLastName = ko.observable();
    self.newBookingAddressLine1 = ko.observable();
    self.newBookingAddressLine2 = ko.observable();
    self.newBookingTown = ko.observable();
    self.newBookingPostcode = ko.observable().extend({required: true});

    //values for page 2
    self.newBookingFeeVisible = ko.observable(false);
    self.newBookingFeeAmount = ko.observable();
    self.newBookingNotes = ko.observable();

    //values for page 6
    self.newBookingAppointments = ko.observableArray();

    self.newBookingHeader = ko.observable("New Booking - Personal Details");

    self.newBookingPage1 = ko.observable(true);
    self.newBookingPage2 = ko.observable(false);
    self.newBookingSpinnerPage1 = ko.observable(false);
    self.newPageBookingEnableButtonPage2 = ko.observable(true);
    self.newBookingPage3 = ko.observable(false);
    self.newBookingPage4 = ko.observable(false);
    self.newBookingPage5 = ko.observable(false);
    self.newBookingAddressSelectIsVisible = ko.observable(false);
    self.newBookingAddressDetailsAreVisible = ko.observable(false);
    self.newBookingAddressList = ko.observableArray();
    self.newBookingPage6 = ko.observable(false);
    self.newBookingPage7 = ko.observable(false);
    self.newBookingTypeOfPestChange = function(){
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      //booking.PestID = $(this).val();
      booking.PestID = $('#newBookingTypeOfPest').val();
      sessionStorage.booking = JSON.stringify(booking);
    }

    self.loginUsername = ko.observable();
    self.loginPassword = ko.observable();
    self.loginError = ko.observable(false);
    self.loginErrorContract = ko.observable(false);
    self.loginSpinner = ko.observable(false);

    self.newAccountEmail = ko.observable();
    self.newAccountSubmit = function(){
      //var form = $('#tst');
      //console.log(form.validate());
      // if ($('#tst').valid()){
       $.ajax({
         url: url() + 'booking/createnewuseraccount',
         type: 'POST',
         data: $('#tst').serialize(),
         success: function(response, textStatus, xhr){
          console.log(xhr.status);
           model.showNewBooking();    
         },
         error: function(xhr, err){
          console.log(xhr.status);
         }
       })
    //}
    //return false;
    }

    //booking confirmation page
    self.confirmationReference = ko.observable();
    self.confirmationDate = ko.observable();
    self.confirmationCost = ko.observable();
    self.confirmationAddressLine1 = ko.observable();
    self.confirmationPhone = ko.observable();
    self.confirmationEmail = ko.observable();
    self.confirmationPestType = ko.observable();
    self.confirmationPestLocation = ko.observable();
    self.confirmationPestNotes = ko.observable();

    self.forgottenPassword = function(){
      self.homeContent(false);
      self.signInContent(false);   
      self.bookingsContent(false);
      self.newBookingContent(false); 
      self.registerContent(false);
      self.passwordResetContent(true);
      model.passwordResetOK(false);
      model.passwordResetError(false);
    }

    self.logOut = function(){
      sessionStorage.clear();

    }

    self.contactFormSubmit = function(){
      $.ajax({
        url: url() + 'booking/submitcontactform',
        type: 'POST',
        data: $('#contactForm').serialize(),
        success: function(){
          self.contactFormContentMessage(true);
          self.contactFormContentForm(false);
        }
      })
      return false;
    }

    self.doMore = function(){
      console.log('more');
      for (var i = 0; i < model.newBookingAddressList().length; i++){
      if (model.newBookingAddressList()[i].uprn == $('#newBookingAddressSelect').val()){
        model.newBookingAddressLine1(model.newBookingAddressList()[i].address);
        model.newBookingTown(model.newBookingAddressList()[i].town);
        //add the selected UPRN to the booking model for Geo processing later
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      booking.UPRN = model.newBookingAddressList()[i].uprn;
      sessionStorage.booking = JSON.stringify(booking);
      }
    }
    model.newBookingAddressDetailsAreVisible(true);
    }

    self.doSomething = function(){
      alert('something');
    }

    self.loggedOutLogIn = function(){
      self.showSignIn();
    }
    self.loggedOutCreateNewAccount = function(){
      self.showRegister();
    }

    self.registerNewAccount = function(){
      self.signInContent(false);
      self.registerContent(true);
    }

    self.registerContentSubmit = function(){
      
    }

    self.newBookingAddressSearch = function(){
      var count = 0;
      var q = JSON.stringify(
        {
          "from" : 0, "size" : 100,
          "min_score": 4.9,
          "sort" : [
        { "paon_start_num" : {"order" : "asc"}},
        { "saon_start_num" : {"order" : "asc"}}
    ],
                "query": {
                    "bool": {
                        "must": [
                        {
match:{
 "postcode": self.newBookingPostcode()
}

                        }
                        ]
                    }
                }
            }
        );
      $.ajax({
        url: 'http://kmbccorpweb03:9200/knowsleycitizen/address/_search',
        type: 'POST',
        data: q,
        dataType: 'json',
        success: function(response){
          self.newBookingAddressSelectIsVisible(true);
          $('#newBookingAddressSelect').empty();
          self.newBookingAddressList.removeAll();
          for (var i = 0; i < response.hits.hits.length; i++) {
                        var hit = response.hits.hits[i];
                        if (hit) {
                            //if (hit._score > 5){
                              count++;
            $('#newBookingAddressSelect').append($('<option></option>').val(hit._source.uprn).html(hit._source.address));
            self.newBookingAddressList.push(hit._source);
                            //}
                        }
                    }
                    if (count > 0){
                    $('#newBookingAddressSelect option').eq(0).before($("<option></option>").val('').html("--select--"));
          $('#newBookingAddressSelect').val($('#newBookingAddressSelect option').eq(0).val());  
                    }
                    else
                    {
                      $('#newBookingAddressSelect').append($('<option></option>').val('').html("--no results, please enter manually--"));
          $('#newBookingAddressSelect').val($('#newBookingAddressSelect option').eq(0).val());
          self.newBookingAddressDetailsAreVisible(true);
                    }
                    
      }
    });
    };

    self.newBookingPage1Page2 = function(){
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      booking.AddressLine1 = self.newBookingAddressLine1();
      booking.Postcode = self.newBookingPostcode();
      sessionStorage.booking = JSON.stringify(booking);
      self.newBookingSpinnerPage1(true);
      $('#newBookingTypeOfPest').empty();
      $('#newBookingLocationOfPest').empty();
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      $.ajax({
        url: url() + 'booking/listpests',
        data: {'customertype': booking.CustomerType},
        success: function(response){
          $.each(response, function(i, item) {
            console.log(item);
            $('#newBookingTypeOfPest').append($('<option></option>').val(item.PestID).html(item.Description + " [£" + item.Fee + "]"));
          });
          $('#newBookingTypeOfPest option').eq(0).before($("<option></option>").val('').html("--select--"));
          $('#newBookingTypeOfPest').val($('#newBookingTypeOfPest option').eq(0).val());
        },
        complete: function(){
          $.ajax({
            url: url() +'admin/listpestlocations',
            success: function(response){
              $.each(response, function(i, item) {
                $('#newBookingLocationOfPest').append($('<option></option>').attr('value', item.PestLocationID).text(item.Location));
              });
              $('#newBookingLocationOfPest option').eq(0).before($("<option></option>").val('').html("--select--"));
              $('#newBookingLocationOfPest').val($('#newBookingLocationOfPest option').eq(0).val());
            },
            complete: function(){
              self.newBookingPage1(false);
              self.newBookingPage2(true);
              self.newBookingHeader("New Booking - Pest Details");
              self.newBookingSpinnerPage1(false);    
              //self.newPageBookingEnableButtonPage2(true);
            }
          })
        }
      })
      
    }
    // self.newBookingPage2Page1 = function(){
    //   self.newBookingPage2(false);
    //   self.newBookingPage1(true);
    //   self.newBookingHeader("New Booking - Personal Details");
    // }
    self.newBookingPage2Page3 = function(){
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      if (typeof self.newBookingNotes() == 'undefined'){
        booking.Notesback = "";
      }
      else{
        booking.Notesback = self.newBookingNotes();
      }
      sessionStorage.booking = JSON.stringify(booking);
      self.newBookingPage2(false);
      self.newBookingPage3(true);
      self.newBookingHeader("New Booking - Your Appointment");
      //return false;
    };
    self.newBookingPage4Page5 = function(){
      var booking = JSON.parse(sessionStorage.getItem('booking'));
      console.log(self.customerID());
      booking.CustomerId = self.customerID();
      console.log(booking);
      $.ajax({
        url: url() + 'booking/makebooking',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(booking),
        success: function(response){
          console.log(response);
          self.newBookingPage4(false);
          self.newBookingPage5(true);
          self.newBookingHeader("New Booking - Confirmation");
          self.confirmationReference(response.BookingConfirmation.bookingid);    
          var d = new Date(response.BookingConfirmation.bookingdate)
          self.confirmationDate(days[d.getDay()] + ' ' + friendlyDate(d) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear());
          self.confirmationAddressLine1(response.BookingConfirmation.addressline1);
          self.confirmationEmail(response.BookingConfirmation.email);
          self.confirmationPestType(response.BookingConfirmation.pesttype);
          self.confirmationPestLocation(response.BookingConfirmation.pestlocation);
          self.confirmationPestNotes(response.BookingConfirmation.pestnotes);
          self.confirmationCost(response.BookingConfirmation.cost);
        }
      })
    }

    self.newBookingBookNextAvailable = function(){
      //call the getnextavailablebooking method in the api
      $.ajax({
        url: url() + 'booking/getnextavailablebooking',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        data: sessionStorage.booking,
        success: function(response){
          //console.log(response);
          sessionStorage.removeItem('booking');
          sessionStorage.setItem('booking', JSON.stringify(response)); 
          self.newBookingPage3(false);
          self.newBookingPage4(true);
          self.newBookingHeader("New Booking - Make a Payment");
        }
      })
    }
    self.newBookingChooseSpecific = function(){
      self.newBookingPage3(false);
      self.newBookingPage6(true);
      self.newBookingHeader("New Booking - Choose day of appointment");
      $.ajax({
        url: url() + 'booking/sevendays',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        data: sessionStorage.booking,
        success: function(response){
          //var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          //var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          self.newBookingAppointments.removeAll();
          for (var i = 0; i < 7; i++){
            var d = new Date(response[i]);
            self.newBookingAppointments().push(d);
            $('#appt' + i).html(days[d.getDay()] + ' ' + friendlyDate(d) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear());
          }
        }
      });
    }

    self.iAmAlreadyRegistered = function(){
      self.showSignIn();
    }
    
    self.doINeedToLogIn = function(whatShouldIShow){
       if (sessionStorage && !sessionStorage.getItem('email')){
        self.showSignIn();
      }
      else{
        self.whereToNext(whatShouldIShow);
        if (self.whereToNext() == "bookings"){
          self.showBookings();
        }
        else if (self.whereToNext() == "newbooking"){
          self.showNewBooking();
        }
      }
      return false;
    };

    self.navigate = function(){
      //console.log(self.whereToNext());
      if (self.whereToNext() == 'newbooking'){
        self.showNewBooking();
      }
      else if (self.whereToNext() == 'portal'){
        self.showPortal();
      }
      //get out clause so I can make it navigate to nowhere
      else{

      }
      self.whereToNext('');
    }

    self.signIn = function(){
        sessionStorage.setItem('email', self.signInEmail());
        //self.loggedOutNav(false);
        //self.loggedInNav(true);
        self.navigate();
        
    }
    //self.signOut = function(){
      
    //}

self.doSomethingElse = function(){
  console.log('somethingelse');
}

self.signInSubmit = function(target){
  var email = model.loginUsername();
    if ($('#loginFrm').valid()){
      model.loginSpinner(true);
        var signin = {
                  "EmailAddress": model.loginUsername(),
                  "Password": model.loginPassword()
              };
        $.ajax({
          url: url() + 'booking/login',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(signin),
          success: function(response){
            if (response.FirstName != null && response.LastName != null){
              //$('#frog').text(email);
              sessionStorage.setItem('email', email);
              //need to put something in here to stop non - contract customers logging into the portal section
              //check the response - if they are not a contract customer and the whereToNext value is portal give them a message
              if (response.CustomerType == "Contract"){

              }
              else{
                if (self.whereToNext() == "portal"){
                  //residential / commercial user can't access the portal so throw a suitable message in here
                  self.whereToNext('');
                  console.log("can't access the portal");
                  self.loginErrorContract(true);
                }
                else{
                  model.newBookingFirstName(response.FirstName);
                  model.newBookingLastName(response.LastName);
                  model.customerID(response.CustomerID);    
                }
              }
              self.navigate();
            }
            else{
              model.loginError(true);  
            }
          },
          complete: function(){
            model.loginSpinner(false);
          }
        })
     }
    return false;
}

    self.showBookings = function(){
          self.homeContent(false);
          self.signInContent(false);   
          self.bookingsContent(true);
          self.newBookingContent(true);
          self.registerContent(false);
          self.contactFormContent(false);
          self.portalContent(false);
    }
    self.showSignIn = function(target){
          self.whereToNext(target);
          console.log(self.whereToNext())
          self.homeContent(false);
          self.signInContent(true);   
          self.bookingsContent(false);
          self.newBookingContent(false); 
          self.registerContent(false);
          self.contactFormContent(false);
          self.portalContent(false);
    }

    self.showRegister = function(){
     self.homeContent(false);
          self.signInContent(false);   
          self.bookingsContent(false);
          self.newBookingContent(false); 
          self.registerContent(true); 
          self.contactFormContent(false);
          self.portalContent(false);
    }
    self.showHome = function(){
     self.homeContent(true);
          self.signInContent(false);   
          self.bookingsContent(false);
          self.newBookingContent(false); 
          self.registerContent(false);  
          self.contactFormContent(false);
          self.portalContent(false);
    }

    self.showContactForm = function(){
     self.homeContent(false);
          self.signInContent(false);   
          self.bookingsContent(false);
          self.newBookingContent(false); 
          self.registerContent(false);   
          self.contactFormContent(true);
          self.portalContent(false);
    }

    self.showPortal = function(){
          $.ajax({
            url: url() + 'booking/contractdetails',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({'EmailAddress': sessionStorage.getItem('email'), 'Password': '', 'Hash': ''}),
            success: function(response){
              var d = new Date(response.StartDate)
              self.contractStartDate(friendlyDate(d) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear());
              var dd = new Date(response.EndDate)
              self.contractEndDate(friendlyDate(dd) + ' ' + months[dd.getMonth()] + ' ' + dd.getFullYear());
              self.contractFee(response.Fee);
              self.homeContent(false);
          self.signInContent(false);   
          self.bookingsContent(false);
          self.newBookingContent(false); 
          self.registerContent(false);   
          self.contactFormContent(false); 
          self.portalContent(true);
            }
          })
          
    }
    
    self.showNewBooking = function(){
      //at this point create an object in session storage for the booking model
      var booking = {
                "BookingId": 0,
                "CustomerId": 0,
                "TopLevelAreaId": 0,
                "PestId": 0,
                "PestType": "",
                "PaymentNeeded": false,
                "Paid": false,
                "FeePaid": 0,
                "ReceiptId": "",
                "BookedDate": "",
                "Notesback": "",
                "Postcode": "",
                "CustomerType": 1,
                "UPRN": "",
                "AddressLine1": ""
            };

      if (sessionStorage && !sessionStorage.getItem('booking')) {
        sessionStorage.setItem('booking', JSON.stringify(booking));
      }
      else if (sessionStorage && sessionStorage.getItem('booking')) {
        sessionStorage.removeItem('booking');
        sessionStorage.setItem('booking', JSON.stringify(booking)); 
      }

      self.homeContent(false);
      self.bookingsContent(false);
      self.signInContent(false);
      self.registerContent(false);
      self.newBookingContent(true);
    }
  }