const { execSync } = require('child_process')
const fs = require('fs')

// Auto-install packages
console.log('📦 Installing packages...')
try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ All packages installed successfully!')
} catch (error) {
    console.error('❌ Failed to install packages:', error.message)
    process.exit(1)
}

const wait = require('wait')
require('dotenv').config()
const path = require('path')
const Sentinel = require(`./structures/Sentinel.js`)
const client = new Sentinel()
this.config = require(`${process.cwd()}/config.json`);
(async () => {
    await client.initializeMongoose()
    await client.initializedata()
    await wait(3000);
    (await client.loadEvents()) - (await client.loadlogs())
    await client.loadMain()
    await client.login(this.config.TOKEN)

})()
