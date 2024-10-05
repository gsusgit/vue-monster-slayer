const attackvalue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

Vue.createApp({
    data() {
        return {
            gameStarted: false,
            playerHealth: 100,
            monsterHealth: 100,
            PLAYER_MIN_DAMAGE: 5,
            PLAYER_MAX_DAMAGE: 12,
            PLAYER_SPECIAL_MIN_DAMAGE: 10,
            PLAYER_SPECIAL_MAX_DAMAGE: 25,
            MONSTER_MIN_DAMAGE: 7,
            MONSTER_MAX_DAMAGE: 14,
            logs: [],
            specialAttackAvailable: false,
            currentRound: 0,
            gameEnded: false,
            winner: '',
            sounds: {
                theme: new Audio('/assets/sounds/theme.mp3'),
                attack: new Audio('/assets/sounds/attack.mp3'),
                special: new Audio('/assets/sounds/special.mp3'),
                healing: new Audio('/assets/sounds/healing.mp3'),
                win: new Audio('/assets/sounds/win.mp3'),
                loose: new Audio('/assets/sounds/loose.mp3'),
            }
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                this.monsterHealth = 0
                this.gameEnded = true
                this.winner = 'PLAYER'
                this.stopSound('theme')
                this.playSound('win')
            }
            return { width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
            if (this.playerHealth <= 0) {
                this.playerHealth = 0
                this.gameEnded = true
                this.winner = 'MONSTER'
                this.stopSound('theme')
                this.playSound('loose')
            } else if (this.playerHealth >= 100)
                this.playerHealth = 100
            return { width: this.playerHealth + '%'}
        }
    },
    methods: {
        start() {
            this.gameStarted = true
            this.playSound('theme')
        },
        attackMonster() {
            this.monsterHealth -= attackvalue(this.PLAYER_MIN_DAMAGE, this.PLAYER_MAX_DAMAGE)
            this.attackPlayer()
            this.setRound()
            this.logs.push(`ATTACKING!`)
            this.playSound('attack')
        },
        attackPlayer() {
            this.playerHealth -= attackvalue(this.MONSTER_MIN_DAMAGE, this.MONSTER_MAX_DAMAGE)
        },
        specialAttack() {
            this.monsterHealth -= attackvalue(this.PLAYER_SPECIAL_MIN_DAMAGE, this.PLAYER_SPECIAL_MAX_DAMAGE)
            this.attackPlayer()
            this.logs.push(`SPECIAL ATTACK!!!`)
            this.currentRound = 0
            this.specialAttackAvailable = false
            this.healAvailable = false
            this.playSound('special')
        },
        setRound() {
            if (this.currentRound < 2) {
                this.currentRound++
                this.specialAttackAvailable = false
                this.healAvailable = false
            } else if (this.currentRound === 2) {
                this.specialAttackAvailable = true
            }
        },
        heal() {
            this.playerHealth += attackvalue(this.PLAYER_MIN_DAMAGE, this.PLAYER_MAX_DAMAGE)
            this.specialAttackAvailable = false
            this.currentRound = 0
            this.logs.push(`HEALING...`)
            this.playSound('healing')
        },
        surrender() {
            this.playerHealth = 0
            this.stopSound('theme')
            this.playSound('loose')
        },
        restart() {
            this.playerHealth = 100
            this.monsterHealth = 100
            this.specialAttackAvailable = false
            this.currentRound = 0
            this.logs = []
            this.gameEnded = false
            this.winner = ''
            this.playSound('theme')
        },
        playSound(soundName) {
            if (this.sounds[soundName]) {
                this.sounds[soundName].play();
            }
        },
        stopSound(soundName) {
            if (this.sounds[soundName]) {
                this.sounds[soundName].pause();
                this.sounds[soundName].currentTime = 0;
            }
        }
    }
}).mount('#game')