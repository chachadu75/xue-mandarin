// Vocabulaire HSK 3 (programme 2012), regroupé par thèmes.
// Format : caractères | pinyin (une syllabe par caractère) | français | exemple | traduction | [texte lu par la synthèse vocale]
// Le dernier champ sert pour les caractères à plusieurs lectures (还 huán, 长 zhǎng…) :
// on fait lire un homophone pour que l'audio corresponde au bon pinyin.

const RAW = `
## Famille et personnes
阿姨|ā yí|tante ; madame (femme d'âge mûr)|阿姨，您好！请问洗手间在哪儿？|Bonjour madame ! Où sont les toilettes, s'il vous plaît ?
叔叔|shū shu|oncle ; monsieur (homme d'âge mûr)|叔叔给了我一个很好看的礼物。|Mon oncle m'a offert un très joli cadeau.
奶奶|nǎi nai|grand-mère (paternelle)|奶奶每天早上去公园锻炼身体。|Ma grand-mère va faire de l'exercice au parc tous les matins.
爷爷|yé ye|grand-père (paternel)|爷爷年轻的时候是一名司机。|Quand il était jeune, mon grand-père était chauffeur.
邻居|lín jū|voisin|我的邻居很热情，经常帮助我。|Mon voisin est très chaleureux, il m'aide souvent.
同事|tóng shì|collègue|我和同事一起去吃午饭。|Je vais déjeuner avec mes collègues.
经理|jīng lǐ|directeur, manager|经理正在开会，请您等一下。|Le directeur est en réunion, veuillez patienter un instant.
客人|kè rén|invité ; client|今天晚上家里有客人。|Ce soir, nous avons des invités à la maison.
司机|sī jī|chauffeur|出租车司机对这个城市很了解。|Le chauffeur de taxi connaît très bien cette ville.
校长|xiào zhǎng|directeur d'école|校长在学校门口欢迎新同学。|Le directeur accueille les nouveaux élèves à l'entrée de l'école.
别人|bié rén|les autres, autrui|不要总是关心别人怎么说。|Ne te soucie pas toujours de ce que disent les autres.
自己|zì jǐ|soi-même|这件事你应该自己决定。|Tu devrais décider de cette affaire toi-même.

## Corps et santé
鼻子|bí zi|nez|熊猫的鼻子是黑色的。|Le nez du panda est noir.
耳朵|ěr duo|oreille|他的耳朵有点儿疼。|Il a un peu mal à l'oreille.
脸|liǎn|visage|她笑的时候脸很红。|Quand elle rit, son visage devient tout rouge.
口|kǒu|bouche ; (classificateur des membres d'une famille)|我家有四口人。|Nous sommes quatre dans ma famille.
脚|jiǎo|pied|走了一天，我的脚很疼。|J'ai marché toute la journée, j'ai mal aux pieds.
腿|tuǐ|jambe|他的腿很长，跑得很快。|Il a de longues jambes, il court très vite.
头发|tóu fa|cheveux|你的头发真好看！|Tes cheveux sont vraiment beaux !
个子|gè zi|taille (d'une personne)|弟弟的个子比我高。|Mon petit frère est plus grand que moi.
矮|ǎi|petit (de taille), bas|我比哥哥矮一点儿。|Je suis un peu plus petit que mon grand frère.
胖|pàng|gros|这只猫太胖了！|Ce chat est trop gros !
瘦|shòu|mince, maigre|她最近瘦了很多。|Elle a beaucoup maigri ces derniers temps.
健康|jiàn kāng|santé ; en bonne santé|多运动对健康很好。|Faire beaucoup de sport, c'est très bon pour la santé.
感冒|gǎn mào|rhume ; s'enrhumer|我感冒了，今天不能去上班。|J'ai attrapé un rhume, je ne peux pas aller travailler aujourd'hui.
发烧|fā shāo|avoir de la fièvre|孩子发烧了，要去医院。|L'enfant a de la fièvre, il faut aller à l'hôpital.
疼|téng|avoir mal, douloureux|我头疼，想休息一下。|J'ai mal à la tête, je voudrais me reposer un peu.
锻炼|duàn liàn|faire de l'exercice, s'entraîner|我每个周末都去锻炼身体。|Je fais du sport tous les week-ends.
刷牙|shuā yá|se brosser les dents|睡觉以前要刷牙。|Il faut se brosser les dents avant de dormir.
洗澡|xǐ zǎo|se laver, prendre une douche|我习惯晚上洗澡。|J'ai l'habitude de me doucher le soir.

## La maison
厨房|chú fáng|cuisine (pièce)|妈妈在厨房做饭。|Maman prépare à manger dans la cuisine.
冰箱|bīng xiāng|réfrigérateur|冰箱里还有一些啤酒。|Il reste quelques bières dans le frigo.
空调|kōng tiáo|climatisation|天气太热了，快开空调吧。|Il fait trop chaud, allume vite la clim.
灯|dēng|lampe, lumière|离开房间的时候请关灯。|Éteignez la lumière en quittant la pièce, s'il vous plaît.
洗手间|xǐ shǒu jiān|toilettes|请问，洗手间在几层？|Excusez-moi, les toilettes sont à quel étage ?
楼|lóu|immeuble ; étage|我住在那个楼的六层。|J'habite au sixième étage de cet immeuble.
层|céng|étage ; couche|我们的办公室在十二层。|Notre bureau est au douzième étage.
电梯|diàn tī|ascenseur|电梯坏了，我们只能走上去。|L'ascenseur est en panne, on doit monter à pied.
搬|bān|déménager ; transporter|我们下个月要搬到北京。|Le mois prochain, nous allons déménager à Pékin.
打扫|dǎ sǎo|nettoyer, faire le ménage|周末我要打扫房间。|Ce week-end, je dois faire le ménage dans ma chambre.
干净|gān jìng|propre|房间打扫得很干净。|La chambre a été très bien nettoyée.
安静|ān jìng|calme, silencieux|图书馆里很安静。|Il fait très calme dans la bibliothèque.
盘子|pán zi|assiette|桌子上有三个盘子。|Il y a trois assiettes sur la table.
碗|wǎn|bol|我吃了两碗米饭。|J'ai mangé deux bols de riz.
筷子|kuài zi|baguettes|你会用筷子吗？|Tu sais utiliser des baguettes ?
瓶子|píng zi|bouteille|这个瓶子里是什么？|Qu'y a-t-il dans cette bouteille ?
伞|sǎn|parapluie|外面下雨了，别忘了带伞。|Il pleut dehors, n'oublie pas de prendre un parapluie.
照相机|zhào xiàng jī|appareil photo|我的照相机是新买的。|Mon appareil photo est tout neuf.
照片|zhào piàn|photo|这张照片是在黄河边上照的。|Cette photo a été prise au bord du fleuve Jaune.
笔记本|bǐ jì běn|carnet ; ordinateur portable|我把笔记本忘在教室了。|J'ai oublié mon carnet dans la salle de classe.
行李箱|xíng li xiāng|valise|你的行李箱太重了！|Ta valise est trop lourde !
信用卡|xìn yòng kǎ|carte de crédit|在这儿可以用信用卡吗？|Peut-on payer par carte de crédit ici ?
护照|hù zhào|passeport|出国的时候一定要带护照。|Il faut absolument prendre son passeport pour aller à l'étranger.
礼物|lǐ wù|cadeau|这是我送给你的生日礼物。|Voici le cadeau d'anniversaire que je t'offre.
包|bāo|sac ; envelopper|我的包里有一本书。|Il y a un livre dans mon sac.

## En ville
城市|chéng shì|ville|上海是一个很大的城市。|Shanghai est une très grande ville.
街道|jiē dào|rue|这条街道很干净。|Cette rue est très propre.
地方|dì fang|endroit, lieu|这个地方的环境很好。|Le cadre de cet endroit est très agréable.
附近|fù jìn|à proximité, environs|这附近有银行吗？|Y a-t-il une banque près d'ici ?
超市|chāo shì|supermarché|我去超市买点儿水果。|Je vais au supermarché acheter des fruits.
银行|yín háng|banque|银行几点关门？|À quelle heure ferme la banque ?
宾馆|bīn guǎn|hôtel|我们住的宾馆离车站很近。|L'hôtel où nous logeons est tout près de la gare.
图书馆|tú shū guǎn|bibliothèque|我经常去图书馆复习。|Je vais souvent réviser à la bibliothèque.
办公室|bàn gōng shì|bureau (pièce)|王经理在办公室吗？|Le directeur Wang est-il dans son bureau ?
公园|gōng yuán|parc|公园里有很多花和树。|Il y a beaucoup de fleurs et d'arbres dans le parc.
地铁|dì tiě|métro|坐地铁去机场很方便。|C'est très pratique d'aller à l'aéroport en métro.
地图|dì tú|carte (géographique)|我们看一下地图吧。|Regardons un peu la carte.
站|zhàn|station, arrêt ; se tenir debout|下一站是北京大学。|Le prochain arrêt est l'Université de Pékin.
船|chuán|bateau|我们坐船去那个小岛。|On prend le bateau pour aller sur cette petite île.
辆|liàng|(classificateur des véhicules)|门口停着一辆红色的车。|Une voiture rouge est garée devant la porte.
骑|qí|monter (à vélo, à cheval)|我每天骑自行车上班。|Je vais au travail à vélo tous les jours.
起飞|qǐ fēi|décoller|飞机马上就要起飞了。|L'avion va bientôt décoller.
方便|fāng biàn|pratique, commode|住在这儿买东西很方便。|Habiter ici, c'est très pratique pour faire les courses.
东|dōng|est|太阳从东边出来。|Le soleil se lève à l'est.
西|xī|ouest|图书馆在学校的西边。|La bibliothèque est du côté ouest de l'école.
南|nán|sud|我是南方人，不习惯北方的冬天。|Je viens du sud, je ne suis pas habitué aux hivers du nord.
北方|běi fāng|nord, le Nord|北方的冬天很冷。|L'hiver est très froid dans le Nord.
中间|zhōng jiān|milieu, entre|银行在超市和宾馆中间。|La banque est entre le supermarché et l'hôtel.
向|xiàng|vers, en direction de|一直向前走，就到了。|Continue tout droit, tu y seras.
经过|jīng guò|passer par|我每天都经过这个公园。|Je passe par ce parc tous les jours.
离开|lí kāi|quitter, partir|他昨天离开了北京。|Il a quitté Pékin hier.
国家|guó jiā|pays|你去过几个国家？|Combien de pays as-tu visités ?
世界|shì jiè|monde|世界上有很多有意思的地方。|Il y a beaucoup d'endroits intéressants dans le monde.
黄河|Huáng hé|le fleuve Jaune|黄河是中国第二长的河。|Le fleuve Jaune est le deuxième plus long fleuve de Chine.
环境|huán jìng|environnement, cadre|这个公园的环境很安静。|Le cadre de ce parc est très calme.

## École et études
班|bān|classe ; équipe|我们班有二十个学生。|Il y a vingt élèves dans notre classe.
年级|nián jí|année (scolaire), niveau|我妹妹上三年级。|Ma petite sœur est en troisième année.
黑板|hēi bǎn|tableau noir|老师在黑板上写字。|Le professeur écrit au tableau.
成绩|chéng jì|résultats, notes|他这次考试成绩很好。|Il a eu de très bons résultats à cet examen.
数学|shù xué|mathématiques|数学对我来说太难了。|Les maths, c'est trop difficile pour moi.
历史|lì shǐ|histoire (discipline)|我对中国历史很感兴趣。|Je m'intéresse beaucoup à l'histoire de la Chine.
文化|wén huà|culture|学习语言也要了解文化。|Apprendre une langue, c'est aussi comprendre sa culture.
体育|tǐ yù|sport, éducation physique|我最喜欢上体育课。|Ce que je préfère, c'est le cours de sport.
中文|Zhōng wén|chinois (langue)|你的中文说得越来越好了！|Ton chinois est de mieux en mieux !
词典|cí diǎn|dictionnaire|这个词我不认识，查一下词典吧。|Je ne connais pas ce mot, cherchons dans le dictionnaire.
句子|jù zi|phrase|请用这个词说一个句子。|Fais une phrase avec ce mot, s'il te plaît.
复习|fù xí|réviser|明天考试，今天晚上要复习。|J'ai un examen demain, je dois réviser ce soir.
练习|liàn xí|exercice ; s'exercer|每天练习十分钟就很有用。|S'exercer dix minutes par jour, c'est déjà très utile.
作业|zuò yè|devoirs|你做完作业了吗？|Tu as fini tes devoirs ?
教|jiāo|enseigner|她教我们写汉字。|Elle nous apprend à écrire les caractères chinois.|交
讲|jiǎng|expliquer, raconter|老师讲得很清楚。|Le professeur explique très clairement.
回答|huí dá|répondre ; réponse|请回答我的问题。|Réponds à ma question, s'il te plaît.
留学|liú xué|étudier à l'étranger|明年我想去中国留学。|L'année prochaine, je voudrais aller étudier en Chine.
水平|shuǐ píng|niveau|我的中文水平还不太高。|Mon niveau de chinois n'est pas encore très élevé.
提高|tí gāo|améliorer, élever|多听多说可以提高口语水平。|Écouter et parler beaucoup permet d'améliorer son oral.
努力|nǔ lì|faire des efforts ; travailleur|只要努力，就一定能学好。|Si on fait des efforts, on y arrivera forcément.
认真|rèn zhēn|sérieux, consciencieux|他学习非常认真。|Il étudie très sérieusement.
聪明|cōng ming|intelligent|这个孩子又聪明又可爱。|Cet enfant est à la fois intelligent et mignon.
明白|míng bai|comprendre ; clair|你明白我的意思吗？|Tu comprends ce que je veux dire ?
了解|liǎo jiě|connaître, comprendre (en profondeur)|我想多了解一下中国文化。|Je voudrais mieux connaître la culture chinoise.
记得|jì de|se souvenir de|你还记得我们第一次见面吗？|Tu te souviens encore de notre première rencontre ?
忘记|wàng jì|oublier|我忘记带护照了！|J'ai oublié de prendre mon passeport !
故事|gù shi|histoire, conte|奶奶给我讲了一个故事。|Grand-mère m'a raconté une histoire.
新闻|xīn wén|actualités, informations|爸爸每天晚上看新闻。|Papa regarde les informations tous les soirs.
节目|jié mù|programme, émission|这个电视节目很有意思。|Cette émission de télé est très intéressante.
音乐|yīn yuè|musique|你喜欢听什么音乐？|Quel genre de musique aimes-tu écouter ?
游戏|yóu xì|jeu|孩子们在玩游戏。|Les enfants sont en train de jouer.
电子邮件|diàn zǐ yóu jiàn|e-mail|我给你发了一封电子邮件。|Je t'ai envoyé un e-mail.
上网|shàng wǎng|aller sur Internet|我每天上网看新闻。|Je vais sur Internet tous les jours pour lire l'actualité.
会议|huì yì|réunion, conférence|会议三点开始。|La réunion commence à trois heures.
爱好|ài hào|loisir, passe-temps|你有什么爱好？|Quels sont tes loisirs ?

## Nature et saisons
春|chūn|printemps|春天来了，花都开了。|Le printemps est arrivé, toutes les fleurs sont écloses.
夏|xià|été|北京的夏天很热。|L'été à Pékin est très chaud.
秋|qiū|automne|秋天是我最喜欢的季节。|L'automne est ma saison préférée.
冬|dōng|hiver|冬天的时候，这里经常下雪。|En hiver, il neige souvent ici.
季节|jì jié|saison|一年有四个季节。|Il y a quatre saisons dans une année.
刮风|guā fēng|faire du vent|今天刮风了，多穿点儿衣服。|Il y a du vent aujourd'hui, couvre-toi bien.
太阳|tài yáng|soleil|今天太阳很大。|Le soleil tape fort aujourd'hui.
月亮|yuè liang|lune|今天晚上的月亮又大又圆。|Ce soir, la lune est grande et ronde.
云|yún|nuage|天上一朵云也没有。|Il n'y a pas un seul nuage dans le ciel.
草|cǎo|herbe|请不要在草上走。|Merci de ne pas marcher sur l'herbe.
树|shù|arbre|学校里有很多高高的树。|Il y a beaucoup de grands arbres dans l'école.
花|huā|fleur ; dépenser|这些花真漂亮！我花了一百块。|Ces fleurs sont vraiment belles ! J'ai dépensé cent yuans.
鸟|niǎo|oiseau|树上有一只小鸟。|Il y a un petit oiseau dans l'arbre.
马|mǎ|cheval|你骑过马吗？|Tu es déjà monté à cheval ?
熊猫|xióng māo|panda|熊猫非常可爱。|Les pandas sont très mignons.
动物|dòng wù|animal|你最喜欢什么动物？|Quel est ton animal préféré ?
爬山|pá shān|faire de la randonnée en montagne|周末我们一起去爬山吧！|Allons faire une randonnée ensemble ce week-end !

## Repas et vêtements
菜单|cài dān|menu|服务员，请给我们菜单。|Serveur, le menu s'il vous plaît.
蛋糕|dàn gāo|gâteau|生日蛋糕是妈妈做的。|C'est maman qui a fait le gâteau d'anniversaire.
面包|miàn bāo|pain|我早饭只吃了一个面包。|Au petit-déjeuner, j'ai juste mangé un petit pain.
香蕉|xiāng jiāo|banane|香蕉多少钱一斤？|Combien coûte la livre de bananes ?
啤酒|pí jiǔ|bière|天气热的时候，喝啤酒很舒服。|Quand il fait chaud, boire une bière fait du bien.
饮料|yǐn liào|boisson|你想喝什么饮料？|Qu'est-ce que tu veux boire ?
新鲜|xīn xiān|frais|这些水果很新鲜。|Ces fruits sont très frais.
甜|tián|sucré|这个蛋糕太甜了。|Ce gâteau est trop sucré.
饿|è|avoir faim|我饿了，我们去吃饭吧。|J'ai faim, allons manger.
渴|kě|avoir soif|我渴了，有水吗？|J'ai soif, il y a de l'eau ?
饱|bǎo|rassasié|我吃饱了，谢谢！|J'ai bien mangé, merci !
衬衫|chèn shān|chemise|这件白衬衫是新买的。|Cette chemise blanche vient d'être achetée.
裤子|kù zi|pantalon|这条裤子有点儿短。|Ce pantalon est un peu court.
裙子|qún zi|jupe, robe|你穿这条裙子真漂亮！|Tu es vraiment belle dans cette robe !
帽子|mào zi|chapeau, bonnet|冬天出门要戴帽子。|En hiver, il faut porter un bonnet pour sortir.
皮鞋|pí xié|chaussures en cuir|这双皮鞋多少钱？|Combien coûte cette paire de chaussures en cuir ?
双|shuāng|paire (classificateur)|我买了一双筷子。|J'ai acheté une paire de baguettes.
蓝|lán|bleu|今天的天特别蓝。|Le ciel est particulièrement bleu aujourd'hui.
绿|lǜ|vert|春天，树都绿了。|Au printemps, les arbres reverdissent.
公斤|gōng jīn|kilogramme|我这个月瘦了两公斤。|J'ai perdu deux kilos ce mois-ci.
元|yuán|yuan (unité monétaire)|这本书三十五元。|Ce livre coûte trente-cinq yuans.
角|jiǎo|jiao (0,1 yuan) ; angle, coin|一块钱是十角。|Un yuan vaut dix jiao.|脚
万|wàn|dix mille|这个城市有八百万人。|Cette ville compte huit millions d'habitants.
米|mǐ|mètre ; riz|我家离地铁站只有五百米。|Ma maison n'est qu'à cinq cents mètres du métro.

## Émotions
害怕|hài pà|avoir peur|别害怕，我在这儿。|N'aie pas peur, je suis là.
担心|dān xīn|s'inquiéter|别担心，我会小心的。|Ne t'inquiète pas, je ferai attention.
着急|zháo jí|être pressé, s'inquiéter|别着急，我们还有时间。|Pas de panique, on a encore le temps.
放心|fàng xīn|être rassuré, avoir l'esprit tranquille|你放心吧，我会照顾好自己。|Sois tranquille, je prendrai bien soin de moi.
生气|shēng qì|se fâcher, être en colère|你为什么生气了？|Pourquoi t'es-tu fâché ?
难过|nán guò|triste, affligé|听到这个消息，我很难过。|J'ai été très triste d'apprendre cette nouvelle.
哭|kū|pleurer|孩子找不到妈妈，哭了。|L'enfant ne trouvait plus sa mère et s'est mis à pleurer.
满意|mǎn yì|satisfait|你对这个成绩满意吗？|Es-tu satisfait de ce résultat ?
愿意|yuàn yì|vouloir bien, être disposé à|你愿意和我一起去吗？|Veux-tu bien venir avec moi ?
热情|rè qíng|chaleureux, enthousiaste|这里的人都很热情。|Les gens d'ici sont très chaleureux.
关心|guān xīn|se soucier de, prendre soin de|谢谢你的关心！|Merci de ta sollicitude !
感兴趣|gǎn xìng qù|s'intéresser à|我对音乐很感兴趣。|Je m'intéresse beaucoup à la musique.
相信|xiāng xìn|croire, avoir confiance|我相信你一定能做好。|Je crois que tu vas forcément y arriver.
可爱|kě ài|mignon, adorable|这只小狗真可爱！|Ce petit chien est vraiment mignon !
舒服|shū fu|confortable, se sentir bien|我今天有点儿不舒服。|Je ne me sens pas très bien aujourd'hui.
奇怪|qí guài|bizarre, étrange|真奇怪，他怎么还没来？|C'est bizarre, pourquoi n'est-il pas encore arrivé ?
习惯|xí guàn|habitude ; s'habituer|你习惯这里的生活了吗？|Tu t'es habitué à la vie ici ?

## Verbes du quotidien
把|bǎ|(particule : place l'objet avant le verbe)|请把门关上。|Ferme la porte, s'il te plaît.
被|bèi|(marque du passif) par|我的自行车被人骑走了。|Mon vélo a été pris par quelqu'un.
帮忙|bāng máng|aider, rendre service|你能帮我一个忙吗？|Tu peux me rendre un service ?
参加|cān jiā|participer à|我参加了学校的比赛。|J'ai participé à la compétition de l'école.
比赛|bǐ sài|compétition, match|明天有一场足球比赛。|Il y a un match de foot demain.
打算|dǎ suàn|prévoir de, compter faire|你周末打算做什么？|Qu'est-ce que tu comptes faire ce week-end ?
带|dài|apporter, emmener|出门的时候带上伞。|Prends un parapluie en sortant.
发|fā|envoyer|到了以后给我发个短信。|Envoie-moi un message quand tu seras arrivé.
发现|fā xiàn|découvrir, remarquer|我发现他今天不太高兴。|J'ai remarqué qu'il n'était pas très content aujourd'hui.
放|fàng|mettre, poser|你把书放在哪儿了？|Où as-tu mis le livre ?
关|guān|fermer, éteindre|出门的时候别忘了关空调。|N'oublie pas d'éteindre la clim en sortant.
换|huàn|changer, échanger|我想换一件大一点儿的。|Je voudrais l'échanger contre une taille un peu plus grande.
还|huán|rendre|我明天把书还给你。|Je te rendrai le livre demain.|环
借|jiè|emprunter, prêter|我可以借你的词典吗？|Je peux emprunter ton dictionnaire ?
接|jiē|aller chercher (qqn) ; recevoir|下午我去机场接朋友。|Cet après-midi, je vais chercher un ami à l'aéroport.
见面|jiàn miàn|se voir, se rencontrer|我们明天在哪儿见面？|Où est-ce qu'on se voit demain ?
检查|jiǎn chá|vérifier, examiner|请再检查一下作业。|Vérifie encore une fois tes devoirs, s'il te plaît.
解决|jiě jué|résoudre|这个问题很容易解决。|Ce problème est très facile à résoudre.
决定|jué dìng|décider ; décision|我决定明年去中国。|J'ai décidé d'aller en Chine l'année prochaine.
结婚|jié hūn|se marier|他们去年结婚了。|Ils se sont mariés l'année dernière.
结束|jié shù|finir, se terminer|比赛几点结束？|À quelle heure se termine le match ?
完成|wán chéng|achever, terminer|我终于完成了今天的作业。|J'ai enfin terminé mes devoirs d'aujourd'hui.
聊天|liáo tiān|bavarder, discuter|我们一边喝茶一边聊天。|On discute tout en buvant du thé.
拿|ná|prendre, tenir|你手里拿的是什么？|Qu'est-ce que tu tiens dans la main ?
请假|qǐng jià|demander un congé|我明天要请假去看医生。|Demain, je prends un congé pour aller chez le médecin.
迟到|chí dào|être en retard|对不起，我迟到了。|Désolé, je suis en retard.
试|shì|essayer|这件衣服我可以试一下吗？|Je peux essayer ce vêtement ?
选择|xuǎn zé|choisir ; choix|你选择哪一个？|Lequel choisis-tu ?
需要|xū yào|avoir besoin de|你需要帮忙吗？|Tu as besoin d'aide ?
要求|yāo qiú|exiger ; exigence|老师要求我们每天写汉字。|Le professeur exige que nous écrivions des caractères tous les jours.
照顾|zhào gù|s'occuper de|她在家照顾生病的奶奶。|Elle s'occupe à la maison de sa grand-mère malade.
注意|zhù yì|faire attention à|过马路的时候要注意安全。|Fais attention en traversant la rue.
小心|xiǎo xīn|faire attention ; prudent|小心！地上有水。|Attention ! Il y a de l'eau par terre.
遇到|yù dào|rencontrer (par hasard), tomber sur|我在超市遇到了老同学。|J'ai croisé un ancien camarade au supermarché.
出现|chū xiàn|apparaître|天上出现了很多云。|Beaucoup de nuages sont apparus dans le ciel.
同意|tóng yì|être d'accord|我同意你的看法。|Je suis d'accord avec ton point de vue.
认为|rèn wéi|penser, estimer|我认为这个办法很好。|Je pense que c'est une très bonne méthode.
以为|yǐ wéi|croire (à tort)|我以为你已经走了。|Je croyais que tu étais déjà parti.
起来|qǐ lái|se lever|快起来，已经八点了！|Lève-toi vite, il est déjà huit heures !
画|huà|dessiner, peindre ; tableau|她画的画很漂亮。|Les tableaux qu'elle peint sont très beaux.
用|yòng|utiliser|你会用这个照相机吗？|Tu sais utiliser cet appareil photo ?
像|xiàng|ressembler à ; comme|你长得很像你妈妈。|Tu ressembles beaucoup à ta mère.
长|zhǎng|grandir ; pousser|几年不见，你长高了！|Ça fait des années ! Tu as grandi !|涨
过|guò|passer ; fêter (une fête)|你在哪儿过春节？|Où passes-tu la fête du Printemps ?

## Notions utiles
影响|yǐng xiǎng|influence ; influencer|天气会影响我们的心情。|La météo influence notre humeur.
作用|zuò yòng|effet, rôle|这个药没什么作用。|Ce médicament n'a pas beaucoup d'effet.
关系|guān xi|relation ; lien|我们的关系很好。|Nous avons de très bonnes relations.
变化|biàn huà|changement ; changer|这几年北京的变化很大。|Pékin a beaucoup changé ces dernières années.
机会|jī huì|occasion, opportunité|这是一个很好的机会。|C'est une très bonne occasion.
办法|bàn fǎ|moyen, solution|我们一起想想办法吧。|Réfléchissons ensemble à une solution.
声音|shēng yīn|son, voix|请说话的声音小一点儿。|Parle un peu moins fort, s'il te plaît.
节日|jié rì|fête, jour férié|春节是中国最重要的节日。|La fête du Printemps est la fête la plus importante en Chine.
周末|zhōu mò|week-end|周末你一般做什么？|Que fais-tu en général le week-end ?
种|zhǒng|sorte, type|你喜欢哪种水果？|Quel genre de fruit aimes-tu ?|肿
段|duàn|segment, période ; passage|这段时间我很忙。|Ces temps-ci, je suis très occupé.
条|tiáo|(classificateur des objets longs)|这条路很长。|Cette route est très longue.
张|zhāng|(classificateur des objets plats)|请给我一张地图。|Donnez-moi une carte, s'il vous plaît.
位|wèi|(classificateur poli pour les personnes)|这位是我们的新老师。|Voici notre nouveau professeur.
只|zhī|(classificateur des animaux)|我家有两只猫。|Chez moi, il y a deux chats.|知
分|fēn|minute ; point ; centime|我考了九十分。|J'ai eu quatre-vingt-dix points à l'examen.
刻|kè|quart d'heure|现在是三点一刻。|Il est trois heures et quart.

## Adjectifs
简单|jiǎn dān|simple|这个问题很简单。|Cette question est très simple.
容易|róng yì|facile|说汉语容易，写汉字难。|Parler chinois est facile, écrire les caractères est difficile.
难|nán|difficile|这次考试不太难。|Cet examen n'était pas trop difficile.
清楚|qīng chu|clair|我听不清楚，你能再说一遍吗？|Je n'entends pas bien, tu peux répéter ?
重要|zhòng yào|important|健康是最重要的。|La santé, c'est le plus important.
特别|tè bié|particulièrement ; spécial|今天特别冷。|Il fait particulièrement froid aujourd'hui.
主要|zhǔ yào|principal ; principalement|我来中国主要是为了学汉语。|Je suis venu en Chine principalement pour apprendre le chinois.
有名|yǒu míng|célèbre|这家饭馆很有名。|Ce restaurant est très célèbre.
年轻|nián qīng|jeune|你看起来很年轻。|Tu as l'air très jeune.
老|lǎo|vieux, âgé|我爷爷老了，走得很慢。|Mon grand-père a vieilli, il marche lentement.
旧|jiù|vieux, usé (objets)|这件衣服太旧了。|Ce vêtement est trop vieux.
坏|huài|mauvais ; cassé|我的手机坏了。|Mon téléphone est cassé.
短|duǎn|court|冬天白天很短。|En hiver, les journées sont courtes.
差|chà|mauvais ; manquer|现在差五分八点。|Il est huit heures moins cinq.|诧
其他|qí tā|autre(s)|你还有其他问题吗？|Tu as d'autres questions ?
一样|yí yàng|pareil, identique|我和你的想法一样。|Je pense comme toi.

## Adverbes de temps
马上|mǎ shàng|tout de suite, immédiatement|等一下，我马上就来！|Attends une seconde, j'arrive tout de suite !
刚才|gāng cái|tout à l'heure, à l'instant|刚才谁给我打电话了？|Qui m'a appelé tout à l'heure ?
后来|hòu lái|ensuite, plus tard (au passé)|我们以前是同学，后来成了好朋友。|On était camarades de classe, puis on est devenus de bons amis.
然后|rán hòu|puis, ensuite|先洗手，然后吃饭。|D'abord on se lave les mains, puis on mange.
以前|yǐ qián|avant, autrefois|以前我不会说汉语。|Avant, je ne savais pas parler chinois.
以后|yǐ hòu|après, à l'avenir|下课以后我们去打篮球吧。|Après le cours, allons jouer au basket.
过去|guò qù|le passé ; passer (là-bas)|过去的事就别想了。|Ne pense plus aux choses du passé.
最近|zuì jìn|récemment, ces derniers temps|你最近忙不忙？|Tu es occupé ces temps-ci ?
一会儿|yí huì r|un moment, un instant|请等一会儿。|Attendez un instant, s'il vous plaît.
一直|yì zhí|toujours, sans arrêt ; tout droit|我一直想去中国看看。|J'ai toujours voulu aller voir la Chine.
经常|jīng cháng|souvent|他经常去图书馆看书。|Il va souvent lire à la bibliothèque.
总是|zǒng shì|toujours|他总是迟到。|Il est toujours en retard.
一般|yì bān|en général ; ordinaire|我一般七点起床。|En général, je me lève à sept heures.
终于|zhōng yú|enfin, finalement|我终于找到工作了！|J'ai enfin trouvé du travail !
突然|tū rán|soudain, tout à coup|突然下起了大雨。|Soudain, une grosse pluie s'est mise à tomber.
先|xiān|d'abord|你先走吧，我等一会儿。|Pars en premier, j'attends un peu.
又|yòu|de nouveau ; à la fois|他又迟到了。|Il est encore en retard.
才|cái|seulement (alors), ne… que|我十点才起床。|Je ne me suis levé qu'à dix heures.
久|jiǔ|longtemps|好久不见！|Ça fait longtemps !

## Mots de liaison
其实|qí shí|en fait|其实我不太喜欢吃甜的。|En fait, je n'aime pas trop les choses sucrées.
当然|dāng rán|bien sûr|当然可以！|Bien sûr que oui !
一定|yí dìng|certainement, absolument|你一定要来我家玩儿！|Tu dois absolument venir chez moi !
一共|yí gòng|au total, en tout|一共多少钱？|Ça fait combien en tout ?
必须|bì xū|devoir, il faut|我们必须八点以前到。|Nous devons arriver avant huit heures.
应该|yīng gāi|devoir, il faudrait|你应该多休息。|Tu devrais te reposer davantage.
比较|bǐ jiào|assez, relativement ; comparer|今天比较冷。|Il fait assez froid aujourd'hui.
更|gèng|encore plus|我觉得这个更好看。|Je trouve que celui-ci est encore plus joli.
极|jí|extrêmement|这个菜好吃极了！|Ce plat est délicieux !
多么|duō me|comme, combien (exclamatif)|这里的风景多么美啊！|Que le paysage est beau ici !
越|yuè|plus… plus…|雨越下越大。|La pluie tombe de plus en plus fort.
几乎|jī hū|presque|我几乎每天都练习汉字。|Je m'entraîne aux caractères presque tous les jours.
只|zhǐ|seulement|我只有一个妹妹。|Je n'ai qu'une petite sœur.|指
还是|hái shi|ou (dans une question) ; toujours|你喝茶还是喝咖啡？|Tu bois du thé ou du café ?
或者|huò zhě|ou (dans une affirmation)|周末我在家看书或者看电视。|Le week-end, je lis ou je regarde la télé chez moi.
而且|ér qiě|de plus, en outre|这家饭馆的菜很好吃，而且不贵。|Les plats de ce restaurant sont délicieux, et en plus ce n'est pas cher.
如果|rú guǒ|si|如果明天下雨，我们就不去了。|S'il pleut demain, on n'y va pas.
除了|chú le|à part, sauf|除了数学，我都喜欢。|À part les maths, j'aime toutes les matières.
为|wèi|pour|我为你感到高兴。|Je suis content pour toi.|位
为了|wèi le|afin de, pour|为了提高中文水平，他每天练习。|Pour améliorer son niveau de chinois, il s'entraîne tous les jours.
关于|guān yú|au sujet de, concernant|这是一本关于中国历史的书。|C'est un livre sur l'histoire de la Chine.
根据|gēn jù|selon, d'après|根据天气预报，明天会下雨。|D'après la météo, il va pleuvoir demain.
跟|gēn|avec ; suivre|我跟你一起去。|J'y vais avec toi.
一边|yì biān|tout en (faisant)|他一边吃饭一边看手机。|Il regarde son téléphone tout en mangeant.
地|de|(particule adverbiale : -ment)|他高兴地笑了。|Il a souri joyeusement.|的
啊|a|(particule exclamative)|今天天气多好啊！|Qu'il fait beau aujourd'hui !
`

export type Word = {
  id: string
  hanzi: string
  /** une syllabe pinyin (avec diacritiques) par caractère */
  syl: string[]
  fr: string
  ex: string
  exFr: string
  /** texte à faire lire par la synthèse vocale si différent de hanzi */
  tts?: string
  lesson: number
}

export type Lesson = { id: number; title: string; wordIds: string[] }

function parse() {
  const words: Word[] = []
  const lessons: Lesson[] = []
  let current: Lesson | null = null
  for (const rawLine of RAW.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('## ')) {
      current = { id: lessons.length, title: line.slice(3), wordIds: [] }
      lessons.push(current)
      continue
    }
    const [hanzi, py, fr, ex, exFr, tts] = line.split('|')
    const syl = py.split(' ')
    if (syl.length !== [...hanzi].length && import.meta.env.DEV) {
      console.warn('Syllabes ≠ caractères pour', hanzi, py)
    }
    const id = 'w' + String(words.length + 1).padStart(3, '0')
    words.push({ id, hanzi, syl, fr, ex, exFr, tts: tts || undefined, lesson: current!.id })
    current!.wordIds.push(id)
  }
  return { words, lessons }
}

export const { words: WORDS, lessons: LESSONS } = parse()
export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.id, w]))

/** Tous les caractères distincts du vocabulaire (pour les données de tracé). */
export function allChars(): string[] {
  return [...new Set(WORDS.flatMap((w) => [...w.hanzi]))]
}
