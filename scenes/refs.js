'use strict';
/* 參考資料：一頁，兩欄，依段落分組（出處 + 支持哪一句 + 網址） */
section('refs', NOTES_BY_SECTION.refs, (b) => {
  const G1 = [
    ['第一段　我們到底多黏手機', [
      ['數位時代，2026/6/26', 'LINE 每月活躍用戶 2,200 萬，台灣約 2,325 萬人', 'https://www.bnext.com.tw/article/91351/line-taiwan-make-every-conversation-become-the-deal'],
      ['兒福聯盟，2024/7/19', '國高中生平均每天用社群媒體超過 4 小時', 'https://www.children.org.tw/news/news_detail/3170'],
      ['Hall (2018)，堪薩斯大學新聞稿', '從不熟到好朋友，約需相處 200 小時以上', 'https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend']]],
    ['第二段　什麼才叫真正的溝通', [
      ['Kruger, Epley, Parker & Ng (2005)，NYU Stern 摘要', '用 email 傳話的人，高估對方看懂語氣的程度', 'https://www.stern.nyu.edu/experience-stern/faculty-research/justin-kruger-email-research']]],
    ['第三段　偷走溝通的三個小偷', [
      ['Pew Research Center，2015/8/26', '聚會時用手機；覺得會讓聊天變差', 'https://www.pewresearch.org/internet/2015/08/26/americans-views-on-mobile-etiquette/'],
      ['兒福聯盟，2015/11/30', '國小五、六年級生覺得爸媽只顧看手機', 'https://www.children.org.tw/news/news_detail/1487'],
      ['Przybylski & Weinstein (2013)，Scientific American', '旁邊放手機，陌生人聊完比較不親近', 'https://www.scientificamerican.com/article/how-your-cell-phone-hurts-your-relationships/'],
      ['Dwyer, Kushlev & Dunn (2018)，ScienceDaily', '手機放桌上，吃飯比較分心、沒那麼開心', 'https://www.sciencedaily.com/releases/2018/02/180226122506.htm'],
      ['Linares & Sellier (2021)，PLOS ONE', '2021 年重做實驗，沒有得到一樣的結果', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0251451']]]
  ];
  const G2 = [
    ['第四段　手機不是壞人', [
      ['Pew Research Center，2022/11/16', '更知道朋友的生活；遇到困難覺得有人支持', 'https://www.pewresearch.org/internet/2022/11/16/connection-creativity-and-drama-teen-life-on-social-media-in-2022/']]],
    ['第五段　把溝通找回來的三個小方法', [
      ['Hunt et al. (2018)，ScienceDaily', '每天只用社群 30 分鐘，三週後較不孤單、不憂鬱', 'https://www.sciencedaily.com/releases/2018/11/181108164316.htm'],
      ['WTOP，2012', '手機疊疊樂：先拿手機的人買單（遊戲，不是研究）', 'https://wtop.com/news/2012/01/game-pick-up-your-phone-during-dinner-and-you-pay'],
      ['美國兒科醫學會 Family Media Plan', '餐桌設為無螢幕區', 'https://www.healthychildren.org/English/family-life/Media/Pages/how-to-make-a-family-media-use-plan.aspx'],
      ['Kumar & Epley，UT Austin 新聞稿，2020/9/11', '打電話比想像中不尷尬，感覺更親近', 'https://news.utexas.edu/?p=137097'],
      ['Greater Good，2015/12/7', '「七分鐘」是一位大學生告訴 Sherry Turkle 的說法', 'https://greatergood.berkeley.edu/article/item/how_smartphones_are_killing_conversation'],
      ['Greater Good in Action', '傾聽：重述、提問、把手機收起來', 'https://ggia.berkeley.edu/practice/active_listening']]]
  ];
  const g = item({from: b, to: b + 1, cls: 'fade'});
  text(g, '參考資料', {x: 80, y: 52, size: 50, weight: 700, fill: C.mango, anchor: 'start'});
  paint(el('path', {d: 'M800 110 L800 860'}, g), {stroke: C.line, w: 3});
  const col = (groups, x, y0) => {
    let y = y0;
    groups.forEach(([head, list]) => {
      paint(el('rect', {x, y: y - 13, width: 8, height: 26, rx: 4}, g), {fill: C.mango});
      text(g, head, {x: x + 22, y, size: 22, fill: C.mango, anchor: 'start'});
      y += 38;
      list.forEach(([who, what, url]) => {
        text(g, who, {x, y, size: 20, anchor: 'start'});
        text(g, what, {x, y: y + 25, size: 18, fill: C.muted, anchor: 'start'});
        const u = text(g, url, {x, y: y + 48, size: 12.5, fill: C.muted, anchor: 'start', font: 'mono'});
        u.style.opacity = .8;
        const w = u.getComputedTextLength();
        if (w > 700) u.setAttribute('font-size', 12.5 * 700 / w);
        y += 68;
      });
      y += 6;
    });
  };
  col(G1, 80, 120);
  col(G2, 840, 120);
});
