var BASE_URL = 'https://burning-fire-4148.firebaseio.com';
var chatRef = new Firebase(BASE_URL);

define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var CanvasSurface = require("famous/surfaces/CanvasSurface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var Group = require('famous/core/Group');
    var ViewSequence = require('famous/core/ViewSequence');
    var Timer = require('famous/utilities/Timer');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');

    var FirebaseRef = require('examples/views/Scrollview/firebaseRef');


    function PassesView(options, data) {
      View.apply(this, arguments);
      _createLayout.call(this);
      _createHeader.call(this);
      _createBody.call(this);
      _setListeners.call(this);

    }

    PassesView.prototype = Object.create(View.prototype);
    PassesView.prototype.constructor = PassesView;

    //######## -- MAIN LAYOUT -- ########

    function _createLayout() {

      this.layoutNode = new RenderNode();

      this.passesViewBackground = new Surface({
          size:[undefined,window.innerHeight],
          properties:{
              backgroundColor:'black'
          }
      });

      this.layout = new HeaderFooter({
        headerSize: this.options.headerSize,
        footerSize: this.options.footerSize
      });

      this.layoutModifier = new StateModifier({
        transform: Transform.translate(0, window.innerHeight, 21)
        // transform: Transform.translate(0, 0, 0.1)
      });

      this.add(this.layoutModifier).add(this.layoutNode);
      this.layoutNode.add(this.layout);
      this.layoutNode.add(this.passesViewBackground)
    }

    //########### --- MAIN LAYOUT END --- ########

    //########### --- HEADER BEGIN --- ############

      function _createHeader() {
        this.headerBackgroundSurface = new ContainerSurface({
          classes: ["overview-header-passes"],
          size:[undefined,75],
          properties: {
            backgroundColor: "black", 
            color: "white"
          }
          
        });

        this.headerBackgroundSurfaceMod = new Modifier({
            transform:Transform.translate(0,0,40)
        });

        //creates hamburger icon
        this.hamburgerSurface = new Surface({
          size: [true, true],
          content: '<img width="20" src="src/img/menu-icon.png"/>'
        });

        //creates hamburger icon modifier
        this.hamburgerModifier = new Modifier({
          origin: [0.5, 0.5]
        });

        //adds my passes text to header
        this.myPassesSurface = new Surface({ 
          size: [true, true],
          content: '<div class="city_name">My Passes</div>', 
          properties: {
            color: "white", 
            zIndex: 1000000
          }
        })

        this.myPassesModifier = new Modifier({
          origin: [0.43,0.45]
        })

        this.layout.header.add(this.headerBackgroundSurfaceMod).add(this.headerBackgroundSurface);
        this.headerBackgroundSurface.add(this.hamburgerModifier).add(this.hamburgerSurface);
        this.headerBackgroundSurface.add(this.myPassesModifier).add(this.myPassesSurface);
      }

      //##################-- END OF HEADER ---#################

      function _createBody() {
        this.passScrollView = new Scrollview();
        
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        
        var passScrollViewMod = new StateModifier({
          size: [this.windowWidth,this.windowHeight]
        });

        var backModifier = new StateModifier({
          transform: Transform.behind
        });

        var surfaces = [];

        this.passScrollView.sequenceFrom(surfaces);

        this.userID = FirebaseRef.user.id
        
        this.array = []

        //push pass objects into an array 
        FirebaseRef.chatRef.child('passes').child(FirebaseRef.user.id).limit(100).on('child_added', function(snapshot) {this.array.push(snapshot.val())})

        //loop that calls each panel of passScrollView
        for (var i = 0; i < this.array.length; i++) {

          var passView = new PurchasedPassView({ 
            
          }, undefined, i);

          this._eventInput.pipe(passView);

          this._setItemSyncEvent(passView);

          passView.pipe(this.gymScrollview); // scrolling

          passView.pipe(this._eventOutput); // dragging
          
          surfaces.push(passView);

          //click function to fire detail view

          passView.on('click',this.detail.createDetails.bind(this.detail, passView));

      }


      }

      function _setListeners() {

      }


  module.exports = PassesView;
});