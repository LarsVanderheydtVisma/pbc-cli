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

const createComponent = (dir, name) => {
    const camelCaseName = getFinalName(name, '');

    ['[name].tsx', '[name].css', '[name].stories.tsx', '[name].test.tsx'].forEach((fileName) => {
        fs.readFile(new URL(`./PBC/component/${fileName}`, import.meta.url), 'utf8', (err,data) => {
            if (err) return console.log(err);

            const fileExtension = fileName.split('[name].')[1];
            const result = data
                .replace(/\[name with space\]|name with space/g, getFinalName(name, ' '))
                .replace(/\[name\]|name/g, camelCaseName)
                .replace(/_name/g, `_${camelCaseName}`)
                .replace(/\[nameLowerCase]|nameLowerCase/g, name.replace(/ /g, '-').split('-').map(word => word.toLowerCase()).join(''));

            fs.writeFile(`${dir}/${camelCaseName}.${fileExtension}`, result, 'utf8', (err) => {
                if (err) return console.log(err);
            });

            console.log(`${camelCaseName}.${fileExtension} successfully created`);
        });
    })
}

inquirer.prompt(questions).then(({ name, type }) => {
    const camelCaseName = getFinalName(name, '');
    const dir = `./${camelCaseName}`;

    if (fs.existsSync(dir)) {
        return console.error(`Folder with the name ${camelCaseName} already exists!`);
    }

    fs.mkdirSync(dir);

    if (type === 'component') createComponent(dir, name);
});