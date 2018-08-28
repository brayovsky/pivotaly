module.exports = (view, css) =>
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statistics</title>
</head>
<style>
  ${css}
</style>
<body>
  <div class="container">
    ${view}
  </div>
</body>
</html>
`
