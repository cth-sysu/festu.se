# OrvU data migration script
# Takes SQL data from ./data and formats it for import in RoboMongo

def fetch_user_info():
  mongodbfile = open('../data/orv.json', 'w+')
  dbfile = open('../data/orv.sql', 'r')
  orv = '[\n'
  


  # Line counter
  counter = 1

  for line in dbfile.readlines():
    if counter >= 51 and counter <= 379:
      splitted = line.split("'")

      # Post
      if splitted[1] == 'â€°' or splitted[1] == '%o':
        post = 'Bacchus'
      else:
        post = splitted[1]

      # Year
      if '/' in splitted[3]:
        year = splitted[3].split('/')[0]
      elif '-' in splitted[3]:
        year = splitted[3].split('-')[0]
      else:
        year = splitted[3]
      
      # Fixes year to yyyy format
      if int(year) >= 47:
        year = '19' + year
      else:
        year = '20' + year

      # Name
      name = fix_unicode(splitted[5])
      #print (name)
      
      # Address
      address = fix_unicode(splitted[7])
      #print (address)
      
      # Place
      place = fix_unicode(splitted[9])
      #print (place)

      # Country
      country = fix_unicode(splitted[11])
      #print (country)

      # Phone
      phone = splitted[13]
      #print (phone)

      # Sektion
      sektion = splitted[15]
      #print (sektion)

      # Email
      email = splitted[17]
      #print (email)

      # Social Security Number
      socsec = splitted[19]
      #print (socsec)



      # Done, create JSON data
      new_orv = '    { '

      if name != '':
        new_orv += ('name: "' + name + '", ')

      post_id = ''

      if post == '6':
        post_id = 'ObjectId("574ef0ed5f6af3c3e008a56c")'
      elif post == '66':
        post_id = 'ObjectId("574ef10d5f6af3c3e008a56d")'
      elif post == '$':
        post_id = 'ObjectId("574ef11e5f6af3c3e008a56e")'
      elif post == 'Bacchus':
        post_id = 'ObjectId("574ef1435f6af3c3e008a56f")'
      elif post == 'A':
        post_id = 'ObjectId("574ef15c5f6af3c3e008a570")'
      elif post == 'X':
        post_id = 'ObjectId("574ef16c5f6af3c3e008a571")'

      if post_id != '':
        new_orv += ('post: ' + post_id + ', ')

      if email != '':
        new_orv += ('mail: "' + email + '", ')

      if address != '':
        new_orv += ('adress: "' + address + ', ' + place + '", ')

      if sektion != '':
        new_orv += ('programme: { name: "' + sektion + '"}, ')

      # If they have a year, add it and close the JSON. If not, close JSON.
      if year != '':
        if counter == 379:
          new_orv += ('year: ' + year + '}\n]')
        else:
          new_orv += ('year: ' + year + '},\n')
      else:
        new_orv += ('},\n')

      


      orv += new_orv
      

    counter = counter + 1
    print (orv)
  mongodbfile.write(orv)


def fix_unicode(old):
  if 'Ã©' in old:
    old = old.replace('Ã©', 'é')

  if 'Ã¤' in old:
    old = old.replace('Ã¤', 'ä')

  if 'Ã¶' in old:
    old = old.replace('Ã¶', 'ö')

  if 'Ã–' in old:
    old = old.replace('Ã–', 'Ö')

  if 'Ã¥' in old:
    old = old.replace('Ã¥', 'å')

  if 'Ã…' in old:
    old = old.replace('Ã…', 'Å')

  # Bam?
  new = old

  return new

# Main
if __name__ == "__main__":
  fetch_user_info()


