const { Client, REST, Routes } = require("discord.js")

/**
 *
 * @param {Client} client
 */
async function loadCommands(client) {
   const ascii = require("ascii-table")
   const fs = require("fs")
   const table = new ascii().setHeading("Commands", "Status")

   let commandArray = []

   const commandFolders = fs.readdirSync("./Commands")
   for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"))

      for (const file of commandFiles) {
         const commandFile = require(`../Commands/${folder}/${file}`)

         const properties = { folder, ...commandFile }
         client.commands.set(commandFile.data.name, properties)

         commandArray.push(commandFile.data.toJSON())

         table.addRow(file, "✅")
         continue
      }
   }

   const rest = new REST({ version: "10" }).setToken(client.config.token)
   const clientId = client.config.clientId
   const guildId = client.config.guildId
   try {
      // await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandArray })
      await rest.put(Routes.applicationCommands(clientId), { body: commandArray })
   } catch (error) {
      console.error(error)
   }

   return console.log(table.toString(), "\nLoaded Commands")
}

module.exports = { loadCommands }
