'use strict'

import fs from 'fs'
import fse from 'fs-extra'

import sass from 'node-sass'
import webpack from 'webpack'

import postcss from 'postcss'
import pcScss from 'postcss-scss'
import autoprefixer from 'autoprefixer'

import webpackConfig from '../webpack.config'

const errorReject = (resolve, reject) =>
  (error) => { if (error) reject(error); else resolve() }

new Promise((resolve, reject) =>
  fse.ensureDir('./dist/public', errorReject(resolve, reject)))
.then(() => {
  const webpackJob = new Promise((resolve, reject) => {
    webpack(webpackConfig)
    .run((error, stats) => {
      if (error) reject(error)
      const statString = stats.toString({
        colors: true,
        chunks: stats.hasErrors()
      })
      console.log(statString)
      resolve()
    })
  })

  const copyJob = new Promise((resolve, reject) =>
    fse.copy('./client/public/', './dist/public/', errorReject(resolve, reject)))

  const fontJob = new Promise((resolve, reject) =>
    fse.copy('./node_modules/font-awesome/fonts/', './dist/public/fonts/', errorReject(resolve, reject)))

  const styleJob = new Promise((resolve, reject) => {
    fs.readFile('./client/style.scss', 'utf8', (error, css) => {
      if (error) reject(error)
      else resolve(css)
    })
  })
  .then((css) => postcss([ autoprefixer ]).process(css, { parser: pcScss }))
  .then((result) => {
    return new Promise((resolve, reject) =>
      sass.render({
        file: './client/style.scss',
        data: result.css,
        includePaths: [ './node_modules/font-awesome/scss/' ]
      }, (error, result) => { if (error) reject(error); else resolve(result.css) })
    )
  })
  .then((css) => {
    return new Promise((resolve, reject) => {
      fs.writeFile('./dist/public/style.css', css, errorReject(resolve, reject))
    })
  })

  return Promise.all([
    webpackJob,
    copyJob,
    fontJob,
    styleJob
  ])
})

.then(() => console.log('Build complete'))
.catch((error) => console.error('Error:', error))
