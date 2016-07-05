import fs from 'fs'

import postcss from 'postcss'
import pcScss from 'postcss-scss'
import pcReporter from 'postcss-reporter'
import stylelint from 'stylelint'

import {CLIEngine as ESLint} from 'eslint'

const styleJob = new Promise((resolve, reject) => {
  fs.readFile('./client/style.scss', 'utf8', (error, css) => {
    if (error) reject(error)
    else resolve(css)
  })
})
.then((css) => {
  return postcss([
    stylelint({}),
    pcReporter({})
  ])
  .process(css, { parser: pcScss })
})

const eslintJob = new Promise((resolve, reject) => {
  const eslint = new ESLint({
    envs: ['browser', 'node'],
    useEslintrc: true
  })
  const report = eslint.executeOnFiles(['./client/', './server/', './tools/'])
  const formatter = eslint.getFormatter()
  console.log(formatter(report.results))
  resolve()
})

// TODO glslValidator linter?

Promise.all([
  styleJob,
  eslintJob
])
.then(() => console.log('Linting complete'))
.catch((error) => { if (error) console.error(error.message) })
