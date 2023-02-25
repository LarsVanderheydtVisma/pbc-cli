#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

const questions = [
    {
        type: 'list',
        name: 'type',
        description: 'What would you like to create today?',
        choices: ['component', 'page']
    },
    {
        type: 'input',
        name: 'name',
        description: 'What should be the name of your component?',
        transformer: (text) => text.replace(/ /g, '-'),
    },
];

const getFinalName = (name, joiner) => {
    return name.replace(/ /g, '-').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(joiner);
}

const copyFiles = ({ dir, pages, name, type }) => {
    const camelCaseName = getFinalName(name, '');

    pages.forEach((fileName) => {
        fs.readFile(new URL(`./PBC/${type}/${fileName}`, import.meta.url), 'utf8', (err,data) => {
            if (err) return console.error(err);

            const fileExtension = fileName.split('[name].')[1];
            const result = data
                .replace(/\[name with space\]|name with space/g, getFinalName(name, ' '))
                .replace(/\[nameLowerCase\]|nameLowerCase/g, name.replace(/ /g, '-').split('-').map(word => word.toLowerCase()).join(''))
                .replace(/_name/g, `_${camelCaseName}`)
                .replace(/\[name\]|name/g, camelCaseName);

            fs.writeFile(`${dir}/${camelCaseName}.${fileExtension}`, result, 'utf8', (err) => {
                if (err) return console.error(err);
            });
        });
    });

    console.log('Successfully created all files');
}

const createComponent = (dir, name) => {
    copyFiles({
        dir,
        name,
        type: 'component',
        pages: ['[name].tsx', '[name].stories.tsx', '[name].test.tsx'],
    });
}

const createRoute = (dir, name) => {
    copyFiles({
        dir,
        name,
        type: 'page',
        pages: ['[name].route.tsx', '[name].tsx']
    })
}

const execute = ({ name, type }) => {
    const camelCaseName = getFinalName(name, '');
    const dir = `./${camelCaseName}`;

    if (fs.existsSync(dir)) {
        return console.error(`Folder with the name ${camelCaseName} already exists!`);
    }

    fs.mkdirSync(dir);

    if (type === 'component') createComponent(dir, name);

    if (type === 'page') {
        createRoute(dir, name);
        const componentDir = `${dir}/components/`;
        fs.mkdirSync(componentDir);
        createComponent(componentDir, name);
    }
}

const getArgOption = (param) => {
    // slice 2 because the first arg is usually the path to nodejs, and the second arg is the location of the script you're executing.
    return process.argv.slice(2).find((option) => option.includes(`--${param}`))?.split(`--${param}=`)[1];
}

const getArgCommand = (param) => {
    return process.argv.slice(2).find((option) => option === param);
}

const init = () => {
    const type = getArgOption('type')
    const name = getArgOption('name');

    if (getArgCommand('start') || (!type && !name)) {
        inquirer.prompt(questions).then((answers) => execute(answers));
        return;
    }

    if (!type) {
        throw new Error("type is required");
    }

    if (!name) {
        throw new Error("name is required");
    }

    execute({ name, type });
}

init();