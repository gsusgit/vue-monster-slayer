const attackvalue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

Vue.createApp({
    data() {
        return {
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
            winner: ''
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                this.monsterHealth = 0
                this.gameEnded = true
                this.winner = 'PLAYER'
            }
            return { width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
            if (this.playerHealth <= 0) {
                this.playerHealth = 0
                this.gameEnded = true
                this.winner = 'MONSTER'
            }
            return { width: this.playerHealth + '%'}
        }
    },
    methods: {
        attackMonster() {
            this.monsterHealth -= attackvalue(this.PLAYER_MIN_DAMAGE, this.PLAYER_MAX_DAMAGE)
            this.attackPlayer()
            this.setRound()
            this.logs.push(`ATTACKING!`)
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
        },
        surrender() {
            this.playerHealth = 0
        },
        restart() {
            this.playerHealth = 100
            this.monsterHealth = 100
            this.specialAttackAvailable = false
            this.currentRound = 0
            this.logs = []
            this.gameEnded = false
            this.winner = ''
        }
    }
}).mount('#game')