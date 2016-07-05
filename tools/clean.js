'use strict'

import del from 'del'

del(['./dist/']).then((paths) => {
  console.log('Deleted:')
  for (const path of path) console.log(path)
  console.log(paths)
})
