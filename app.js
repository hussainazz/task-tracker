import yargs from 'yargs'
import fs from 'node:fs'

let argv = yargs(process.argv.slice(2))
    .help(false)
    .parse()
if(argv.status) argv.status = argv.status.toLowerCase()

let tasks = []
try {
    tasks = JSON.parse(fs.readFileSync("tasks.json"))
} catch {
    writeFile()
}
if(argv._[0])
    switch(argv._[0].toLowerCase()){
        case 'add': addTask(); break;
        case 'remove': removeTask(); break;
        case 'list': getAllTasks(); break;
        case 'update': update(); break;
        case 'help': showHelp; break;
        default: 
            console.error('Wrong Command')
            showHelp()
    }
else showHelp()
function writeFile() {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks))
}
function addTask() {
    let newId = tasks.length + 1
    if(tasks.some(item => item.id === newId))
        newId += 1
    if(argv.task)
        tasks.push({
            id: newId,
            task: argv.task,
            status: 'none'
        })
    else console.error("Task should not be empty")
    writeFile()
}
function removeTask() {
    if(argv.id)
        if(tasks.some(item => item.id == argv.id))
            tasks = tasks.filter(item => item.id !== argv.id)
        else console.error('Wrong ID')
    else 
        tasks = []
    writeFile()
}
function getAllTasks() {
    if(argv.status)
        if(['done','none', 'in progress'].includes(argv.status))
            tasks
                .filter(item => item.status === argv.status)
                .forEach(item => console.table(item))
        else
            console.error('Status should be: done/in progress/none')
    else
        if(tasks.length)
            tasks.forEach(item => console.table(item))
        else
            console.error('No task been added')
}
function update() {
    if(!argv.id)
        throw new Error("You didn't set ID")
    if(!tasks.some(item => item.id == argv.id))
        throw new Error('Invalid ID')
    if (argv.task) {
        tasks.find(item => item.id === argv.id).task = argv.task
        writeFile()
    }
    if (argv.status)
        if(['done','none', 'in progress'].includes(argv.status)) {
            tasks.find(item => item.id === argv.id).status = argv.status
            writeFile()
        }
        else
            console.error('Wrong status input')
}
function showHelp() {
    console.log(`
Usage:
  node app.js <command> [options]

Commands:
  add       --task="<task name>"      Add a new task
  remove    [--id=<number>]           Remove a task by ID (no ID removes all)
  list      [--status=<status>]       List tasks (status: done, none, in progress)
  update    --id=<number> [options]   Update a task's text or status
  <Empty>   prints this text

Options:
  --task     Task description
  --status   Task status (done, none, in progress)
  --id       Task ID  

Examples:
  node app.js add --task="Buy milk"
  node app.js list --status=done
  node app.js update --id=1 --status=done
`);
}