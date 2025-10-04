# En kortfattad guide för utvärdering av öppen programvara

*av [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), 2025-03-28*

Innan du använder beroenden eller verktyg som är öppen källkod, bör du, som programutvecklare, identifiera och utvärdera alternativen mot dina behov. För utvärdering av en tänkbar kandidat, ställ dig följande säkerhets- och hållbarhetsfrågor (namngivna verktyg eller tjänster är endast exempel):

## Inledande bedömning

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Överväg behov** | Utvärdera om beroendet kan undvikas genom att använda befintliga komponenter. Varje nytt beroende ökar attackytan (en förvanskning av det nya beroendet, eller dess transitiva beroenden, kan förvanska systemet). |   |
| **Verifiera äkthet** | Verifiera att programvaran som utvärderas är den autentiska versionen från den auktoriserade källan, inte en personlig eller angriparkontrollerad gren (fork). Detta för att motverka den vanliga "typosquatting"-attacken (där en angripare skapar ett "nästan korrekt" namn). Kontrollera beroendets namn och länken för projektets webbplats. Verifiera fork-förhållandet på GitHub/GitLab. Kontrollera om projektet är knutet till en stiftelse. Kontrollera projektets skapelsetid och popularitet. |   |

## Underhåll och hållbarhet

Övergiven programvara utgör en risk; de flesta programvaror behöver kontinuerligt underhåll. Underhålls den inte, är den sannolikt osäker.

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Aktivitetsnivå** | Bekräfta att betydande aktivitet (t.ex. commits) har skett det senaste året. |   |
| **Kommunikation** | Verifiera att det finns nya utgåvor eller tillkännagivanden från projektets förvaltare. |   |
| **Förvaltardiversitet** | Verifiera att det finns mer än en förvaltare, helst från olika organisationer (för att minska risken för enskilda felkällor). |   |
| **Senaste utgåva** | Bekräfta att den senaste utgåvan inte är äldre än ett år. |   |
| **Versionsstabilitet** | Bedöm om versionen visar på instabilitet (t.ex. börjar med "0", inkluderar "alpha" eller "beta", etc.). |   |

## Säkerhetspraxis

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Bedömningsramverk** | Överväg att använda etablerade bedömningsmetoder som [SAFECode:s guide *Principles for Software Assurance Assessment*](https://safecode.org/resource-managing-software-security/principles-of-software-assurance-assessment/) (2019), en flernivåansats för att undersöka programvarans säkerhet. |   |
| **Certifiering av bästa praxis** | Avgör om projektet har förtjänat (eller är på god väg till) ett [Open Source Security Foundation (OpenSSF) Best Practices-märke](https://www.bestpractices.dev/). |   |
| **Hantering av beroenden** | Verifiera att projektets paketberoenden är (relativt) uppdaterade. |   |
| **Kodförrådsäkerhet** | Bekräfta att utvecklarna använder säkerhetsfunktioner i kodsamverkansplattformen där tillämpligt (t.ex. om de använder GitHub eller GitLab, använder de grenskydd(branch-protection)). |   |
| **Säkerhetsrevisioner** | Identifiera befintliga säkerhetsrevisioner och verifiera att identifierade sårbarheter har åtgärdats. Säkerhetsrevisioner är relativt ovanliga, se exempelvis OpenSSF:s "[Säkerhetsgranskningar](https://github.com/ossf/security-reviews)". |   |
| **Säker utveckling** | Bekräfta att projektet tillämpar bästa praxis för säker programvaruutveckling enligt [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software) eller [OpenSSF Open Source Security Baseline](https://baseline.openssf.org/). |   |
| **Säkerhetsdokumentation** | Verifiera att det finns dokumentation som förklarar varför projektet är säkert (även kallat "assurans"). |   |
| **Säkerhetsrespons** | Bedöm om projektet åtgärdar fel (särskilt säkerhetsfel) i tid, om de släpper säkerhetsuppdateringar för äldre utgåvor, och om de har en LTS-version (Long Term Support). |   |
| **Säkerhetspoäng** | Granska information på [https://deps.dev](https://deps.dev/), inklusive dess [OpenSSF Scorecards](https://github.com/ossf/scorecard)-poäng och eventuella kända sårbarheter. |   |
| **Testpraxis** | Utvärdera om det finns automatiserade tester i dess CI-pipeline och vad projektets testtäckning är. |   |
| **Sårbarhetsstatus** | Bekräfta om den aktuella versionen är fri från kända viktiga sårbarheter (särskilt äldre). Organisationer kan vilja implementera [OpenChain](https://www.openchainproject.org/) [Security Assurance Specification 1.1](https://github.com/OpenChain-Project/Security-Assurance-Specification/tree/main/Security-Assurance-Specification/1.1/en) för att systematiskt kontrollera kända sårbarheter vid införande och när nya sårbarheter avslöjas offentligt. |   |

## Användbarhet och säkerhet

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Gränssnittsdesign** | Verifiera att gränssnittet/API:et är designat för enkel användning på ett säkert sätt (t.ex. om gränssnittet implementerar ett språk, stöder det parametriserade frågor). |   |
| **Gränssnittsstabilitet** | Verifiera att gränssnittet/API:et är stabilt eller att projektet har en policy för att undvika och/eller hantera ändringar av gränssnitt/API:er som bryter kompatibilitet. Ett instabilt API är ett betydande hinder för att uppgradera till nyare versioner (t.ex. för att åtgärda sårbarheter). |   |
| **Säkra standardinställningar** | Bekräfta att standardkonfigurationen och "enkla exempel" är säkra (t.ex. kryptering påslagen som standard i nätverksprotokoll). Om inte, undvik det. |   |
| **Säkerhetsvägledning** | Verifiera om det finns vägledning om hur man använder det säkert. |   |
| **Rapportering av sårbarheter** | Bekräfta om det finns instruktioner för hur man rapporterar sårbarheter. Se [Guide för att implementera en process för sårbarhetsavslöjande i öppen källkods-projekt](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md#guide-to-implementing-a-coordinated-vulnerability-disclosure-process-for-open-source-projects) för vägledning till öppen källkodsprojekt. |   |

## Användning och licensiering

Licensramverk har en betydande påverkan på säkerhets- och hållbarhetsställning. Projekt som saknar tydlig licensinformation uppvisar ofta brister i andra säkerhetsmässiga bästa praxis.

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Licenstydlighet** | Verifiera att varje komponent har en licens, att det är en allmänt använd [OSI-licens](https://opensource.org/licenses) om det är öppen källkod, och att den är förenlig med din avsedda användning. Projekt som inte har tydlig licensinformation är mindre benägna att följa andra goda praxis som leder till säker programvara. |   |
| **Namnverifiering** | Kontrollera om ett liknande namn är populärt - det kan indikera en typosquatting-attack. |   |
| **Utbredning** | Bedöm om programvaran har en betydande användning. Välanvänd programvara är mer benägen att visa på hur man använder den på säkert sätt, och fler kommer att bry sig om dess säkerhet. |   |
| **Lämplighet** | Välj programvara som är en bra lösning för ditt problem. Undvik [Hypestyrd utveckling](https://blog.daftcode.pl/hype-driven-development-3469fc2e9b22): Välj inte mjukvara enbart för att den används av stora företag eller för att den är senaste trenden. |   |

## Praktisk testning

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Beteendetestning** | Försök att lägga till beroendet som ett test, helst i en isolerad miljö. Uppvisar det skadligt beteende, t.ex. försöker det exfiltrera känslig data? |   |
| **Beroendepåverkan** | Lägger det till oväntade eller onödiga indirekta beroenden i produktionen? Till exempel, inkluderar det produktionsberoenden som bara krävs under utveckling eller test istället? Om så är fallet, är förvaltarna villiga att åtgärda det? Varje nytt beroende är ett potentiellt supportproblem eller leveranskedjeattack, och det är därför klokt att ha så få sådana som möjligt. |   |

## Kodutvärdering

Även en snabb granskning av programvaran (av dig, anställd eller annan), tillsammans med senaste ändringarna, kan ge dig insikt. Överväg:

| Regel | Beskrivning | Genomfört |
|------|-------------|:--------:|
| **Kodfullständighet** | Utvärdera om det finns bevis på osäker/ofullständig programvara (t.ex. många TODO-uttalanden). |   |
| **Kontroll av skadlig kod** | Analysera om det finns bevis på att programvaran är skadlig. Enligt [*Backstabber's Knife Collection*](https://arxiv.org/abs/2005.09535), kontrollera installationsskript/rutiner för skadlighet, kontrollera dataexfiltrering från **~/.ssh** och miljövariabler, och leta efter kodade/fördolda värden som exekveras. Undersök de senaste commit:sen för misstänkt kod (en angripare kan ha lagt till dem nyligen). |   |
| **Sandlådetestning** | Överväg att köra programvaran i en sandlåda(sandbox) för att försöka utlösa och upptäcka skadlig kod. |   |
| **Säkerhetsimplementationer** | När du granskar källkoden, finns det bevis i koden på att utvecklarna försökt att utveckla säker programvara (som rigorös indata validering av opålitliga indata samt användning av parametriserade frågor)? |   |
| **Säkerhetsgranskningar** | Se [OpenSSF:s lista över säkerhetsgranskningar](https://github.com/ossf/security-reviews/blob/main/Overview.md#readme). |   |
| **Statisk analys** | Vilka är de "främsta" problemen som en statisk kodanalys rapporterar? |   |
| **Testvalidering** | Överväg att köra alla definierade testfall för att säkerställa att programvaran klarar dem. |   |

## Ytterligare resurser

- [Tidelift's guide för att välja paket (februari 2021)](https://tidelift.com/subscription/choosing-open-source-packages-well), Tidelift
- [Hur man utvärderar öppen/fri programvara](https://dwheeler.com/oss_fs_eval.html)

## Dokumenthistorik

| Datum | Beskrivning |
|---------|------|
| 2023-11-21 | Första version |
| 2025-04-23 | Omstrukturering |

*Vi välkomnar förslag och förbättringar! Öppna ett [ärende](https://github.com/ossf/wg-best-practices-os-developers/issues/) eller skicka en [pull request](https://github.com/ossf/wg-best-practices-os-developers/pulls).*
