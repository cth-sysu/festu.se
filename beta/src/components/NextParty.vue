<template>
  <div class="next-party card">
    <div class="header">
      <div class="h3">{{ party.name }}</div>
      <div class="h4">{{ party.date | start }}-{{ party.date | end }}</div>
    </div>
    <div class="poster">
      <img src="https://festu.se/images/parties/5b76f6320be629d0c5a6bd64_small.jpg">
    </div>
    <div class="description">[ENGLISH BELOW]

***************************************************

Se till att avslutet på mottagningen blir episk! Lördagen 15/9 är det dags för Nollfinalen, ett kalas som kommer äga rum i hela kårhuset. Dansa loss på 6 olika dansgolv, bland annat silent disco, laser, och tropic house. Av de 11 barerna kommer det bland annat finnas en choklad-drink-bar, juice-bar och bubbel-bar. Passa också på att utmana dina vänner i en omgång på den mekaniska tjuren!


***************************************************

Alla FestU-kalas är KONTANTFRIA!

Man kommer bara att kunna betala med kort eller kårkort, både inne på kalaset och när man köper biljett. I biljettpriset ingår även garderob.

Betalning med kårkort inne på kalaset ger dig 15% rabatt på allt!

Smidigast laddar du ditt kårkort på: www.bit.ly/chs_ladda

***************************************************

Pris:
Chalmerist med giltigt kårleg: 120kr
Övriga: 150kr

Biljetter kommer att säljas:

12:00-13:00 10/9*
Teknologgården, Johanneberg och hus Jupiter, Lindholmen

12:00-13:00 11/9*
Teknologgården, Johanneberg

Du måste vara chalmerist med giltigt kårkort för att få köpa biljetter, som chalmerist kan du köpa 3 icke-chalmerist-biljetter per chalmerist-biljett. Max 8 biljetter per person.

*vi reserverar oss för eventuella ändringar, 18-års gräns gäller.

Frågor kan ställas här eller mailas till festu@festu.se

***************************************************

Make sure the last day of the reception will be epic! It is time for Nollfinalen Saturday 15/9, a party taking place in all of the student union building. Dance at 6 different dancefloors, some of these being silent disco, laser and a tropic house dancefloor. Among the 11 bars there will be a chocolate-drink-bar, juice-bar and a sparkling wine-bar. Also take the opportunity to challange your friends in the mechanical bull!

***************************************************

All FestU-parties are CASH-FREE!

You will only be able to pay with your Chalmers Union ID (kårkort) or by credit card. This applies to both tickets and inside the party! Wardrobe is included in the ticket.

Paying with your Chalmers Union ID inside the party gives you a 15% discount on everything!

The best way to pre-load your Chalmers Union ID is on: www.bit.ly/chs_ladda

***************************************************
Price:
Chalmerist with a valid Chalmers Union ID: 120kr
Others: 150kr

Tickets will be sold:

12:00-13:00 10/9*
Ouside the Student Union buildig, Johanneberg and house Jupiter, Lindholmen

12:00-13:00 11/9*
Ouside the Student Union buildig, Johanneberg

The person buying must have a valid Chalmers Union ID, however both ticket types can be purchased. For each chalmerist-ticket you can purchase 3 non-chalmerist-tickets. As a total you can buy 8 tickets.

*we reserve the right to make any changes, 18-year age limit applies.

Any questions about the event can be asked here or sent to festu@festu.se
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'NextParty',
  props: {
    party: Object
  },
  filters: {
    start: (date) => moment(date).format('MMMM D, YYYY HH:mm'),
    end: (date) => moment(date).add(6, 'hours').format('HH:mm')
  },
}
</script>

<style scoped lang="scss">
.next-party {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.header {
  flex: 100%;
  margin: 8px;
}
.poster {
  flex: 0 1 180px;
  margin: 8px;
  & img { width: 100%; }
}
.description {
  flex: 1 400px;
  margin: 8px;
  text-align: initial;
  white-space: pre-wrap;
  overflow: hidden;
}
</style>
