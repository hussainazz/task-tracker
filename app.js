import yargs from 'yargs'
import fs from 'node:fs'
import { type } from 'node:os'
import { error } from 'node:console'

let argv = yargs(process.argv.slice(2))
    .help(false)
    .parse()

let command = argv._[0]

let tasks = []
try {
    tasks = JSON.parse(fs.readFileSync("tasks.json"))
} catch {
    writeFile()
}
if(typeof(command) !== 'string')
    console.error('Command should be type of string')
else
    switch(command.toLowerCase()){
        case 'add': addTask(); break;
        case 'remove': removeTask(); break;
        case 'list': diplayTasks(); break;
        case 'update': update(); break;
        case 'mark': mark(); break;
        case 'help': showHelp; break;
        default: 
            console.error(`Command doesn't exist`)
    }
function writeFile() {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks))
}
function addTask() {
    let newId = tasks.length + 1
    let inputTask = argv._[1]
    if(tasks.some(item => item.id === newId))
        newId += 1
    if(inputTask)
        tasks.push({
            id: newId,
            task: inputTask,
            status: 'none'
        })
    else
        console.error("Task should not be empty")
    writeFile()
}
function removeTask() {
    let removeTaskId = argv._[1]
    if(typeof(removeTaskId) === 'string' && removeTaskId.toLowerCase() === 'all')
        tasks = []
    else 
        if(tasks.some(item => item.id == removeTaskId))
            tasks = tasks.filter(item => item.id != removeTaskId)
        else 
            console.error(`You should include ID of task or 'all' for removing all`)
    writeFile()
}
function diplayTasks() {
    let filter = argv._[1]
    if(typeof(filter) === 'string' && filter.toLowerCase() === 'all')
        if(tasks.length)
            tasks.forEach(item => console.table(item))
        else
            console.error('No task been added')
    else
        if(isStatusValid(filter))
            if(tasks.some(item => item.status === filter))
                tasks
                    .filter(item => item.status === filter)
                    .forEach(item => console.table(item))
            else
                console.error(`No task is ${filter}`)
        else
            console.error(`You should include status [done/in-progress/none] or 'all' for listing all`)
}
function update() {
    let taskId = argv._[1]
    let editedTask = argv._[2]
    let idError = handleTaskIdErr(taskId)
    if(!idError && editedTask){
        tasks.find(item => item.id === taskId).task = editedTask
        writeFile()
    }
}
function mark() {
    let editedStatus = argv._[1]
    let taskId = argv._[2]
    let idError = handleTaskIdErr(taskId)
    if(!idError) {
        if(isStatusValid(editedStatus)) {
            tasks.find(item => item.id === taskId).status = editedStatus
            writeFile()
        }
        else
            console.error('Status should be done/in-progress/none')
    }
    else if(!isStatusValid(editedStatus))
        console.error('Status should be done/in-progress/none')
}
function handleTaskIdErr(taskId) {
    try {
        if(!taskId)
            throw `emptyId`
        if(typeof(taskId) != 'number')
            throw `notNumber`
        if(!tasks.some(item => item.id == taskId))
            throw `foundNoTask`
        return false
    }
    catch(error) {
        if(error === `emptyId`)
            console.error(`You should include an ID`)
        if(error === `notNumber`)
            console.error(`The ID should be a number`)
        if(error === `foundNoTask`)
            console.error(`No such task with this ID`)
        return true
    }
}
function isStatusValid(status) {
    return ['done','none', 'in-progress'].includes(status)
}