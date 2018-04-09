// ===============================================================================
// ========================= CONFIG SETUP ============ ===========================
// ===============================================================================

var gameConfig = {};

// synchronous config retrieval: (jQuery)
$.ajax({
    url: '/getGameConfig',
    success: function (result) {
        if (result.isOk == false) alert(result.message);
        gameConfig = result;
    },
    async: false,
})

// ===============================================================================
// ========================= GAME VAR CONFIGURATION == ===========================
// ===============================================================================

var game = new Phaser.Game(gameConfig.boardState.initialWidth, gameConfig.boardState.intiialHeight, Phaser.AUTO, null, {preload: preload, create: create});

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// BEFORE THE GAME IS LOADED
function preload () {

    // LOAD THE RELEVANT RESOURCES
    this.load.image('sky', './assets/sky.png');
    this.load.image('dude', './assets/dude.png');
    this.load.image('star', './assets/star.png');

    // CONFIGURE THE GAME SCALING
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // CONFIGURE INITIAL GAME STYLES
    game.stage.backgroundColor = '#eee';
}

// CREATE THE INITIAL GAME STATE
function create () {
    this.add.image(0, 0, 'sky');
    var particles = this.add.particles('star');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: {start: 1, end: 0},
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400,100, 'dude');

    logo.setVelocity(100, 200);
    logo.setBounce(1,1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}