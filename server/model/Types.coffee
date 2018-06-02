arr = [
  'private' # 1
  'displayGlobal', # 2
  'status',  # 3
  'dateBirth', # 4
  'gender', # 5
  'aboutMe' # 6
  'city' # 7
  'avatar' # 8
]
obj = {}
i = 1
for row in arr
  # console.log row
  obj[row] = i
  obj[i] = row
  i++
module.exports = obj