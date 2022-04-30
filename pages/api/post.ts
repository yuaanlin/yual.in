import Post from '../../models/post';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      res.status(200).json([post1]);
      break;
    case 'POST':
      res.status(200).json({});
      break;
  }
}

const post1: Post = {
  id: 'a',
  title: 'Hello World',
  createdAt: new Date(),
  updatedAt: new Date(),
  content: `
# 菜雞也看得懂的 Typescript 開發環境安裝教學

這篇文章是《菜雞也看得懂的全端專案開發實作教學》系列中的其中一篇文章。跟隨本系列，就算是毫無開發經驗的菜雞也能獨立開發全端專案！

本文是本系列的前端教學的第一篇，在本系列的前端教學中，我們會透過 Typescript 寫一個 React 的網頁 App，並且可以直接把相同的概念移植到 React Native，就可以直接開發手機 App了。

在開始跟隨本文以前，希望你可以先瞭解什麼是 Html 以及什麼是 CSS，試著單純用這兩個工具寫一個不難看的 Hello world 網頁，因為在後續的教學上，我們將著重介紹 Javascript 以及 Typescript。

如果你是完全沒有基礎的同學，不要慌張，可以先從這邊瞭解一下最基礎的知識：

[網頁設計基礎入門：五分鐘認識CSS,HTML,JS](https://medium.com/mr-efacani-teatime/%E4%BA%94%E5%88%86%E9%90%98%E8%AA%8D%E8%AD%98css-html-js-2527e3b4ce6e)

## 一切要從 Javascript 說起

當我們打開一個網頁，舉個例子，Medium 的首頁好了，試著用瀏覽器的開發者工具查看一下網頁的原始碼，你會發現除了 Html 還有 CSS 之外，還有許多的 Javascript 程式碼：

![Javascript 是讓網頁動起來的幕後工程](https://miro.medium.com/max/1400/1*q6x1kO3HKNTUtKFLU_V_Aw.png)

如果說 Html 決定了網頁上的東西怎麼編排，CSS 決定了網頁上的東西有什麼樣的外觀，那麼 Javascript 就決定了網頁上的東西要怎麼「動起來」。

好的，現在讓我們回想一下最一開始學過的前後端的概念，請問：對於正在瀏覽這個網頁的你而言，這些 Html、CSS 和 Javascript 檔案是如何得到的？

> 如果你想不到答案，記得回去看看本系列最前面的《菜雞也看得懂的前後端概念基礎教學》。

答案是你在瀏覽器向 https://medium.com 這個網址發送了一個 Request，然後這個 Request 將這些檔案當作 Response 發送回來我們的瀏覽器，瀏覽器發現他送回來的是 Html、CSS 和 Javascript 這三個他看得懂的東西，所以他就直接幫你顯示到畫面上啦～

下一個問題，如果說這些檔案是透過 Response 發送回來的，那麼請問這些 Javascript 程式是在哪裡、用什麼程式來執行的？

> 先別急著往下看答案哦，我希望大家在跟隨本系列的教學時，都可以自己試著思考問題的答案。

答案是在使用者（也就是你）的電腦上，透過你正在使用的瀏覽器來執行的。這其實非常直觀，既然這些程式碼是瀏覽器接收到的，而且這些程式碼的功能是讓畫面動起來，那麼他們很明顯就是直接由你的瀏覽器執行的對不對。

講到這裡，希望大家可能有一點概念了，那就是 Javascript 這個語言可以用來被瀏覽器執行，而且是在前端（使用者的電腦）上面被執行的。

## 不用瀏覽器也可以跑 — Node.js

有一個神奇的程式叫做 Node.js，他可以讓你的 Javascript 程式碼直接在電腦上運行，不需要透過瀏覽器。我們之後要用的 React 框架也是必須通過 Node.js 執行 Webpack 來打包（下幾章會詳細提到）。

現在我們先去Nodejs 的官方網站下載並且安裝到電腦上吧，選擇適合自己環境的版本並照著指示安裝就可以了。

安裝以後我們在 terminal (終端機) 輸入以下指令來查看安裝好的版本：

➜ node -vv12.18.3

如果成功了看到了版本號，那就說明你成功的安裝 Node 到電腦上了。

現在我們在電腦上找一個地方，新建一個檔案 helloworld.js，在裡面輸入一個簡單的程式碼：

console.log("hello, world!")

    可以看到，javascript 程式碼的副檔名就是 .js。而 console.log() 就是在 javascript 裡面印出東西的指令，相當於 Java 的 system.out.println() 或是 python 的 print()

接下來在 terminal 使用 node 來執行我們剛剛寫好的指令：

➜ node helloworld.js
hello, world!

可以看到我們的程式就這樣被執行了，是不是很簡單呢！

    如果你寫過 python，你可能會覺得這個動作很熟悉。也就是創建一個 helloworld.py，然後在 terminal 輸入 python helloworld.py，他也會印出一樣的結果，這是因為 javascript 和 python 一樣屬於 「直譯式語言」。


和其他的程式語言一樣，在開發的過程我們經常會需要引用外部的函式庫，來幫我們完成一些我們不需要自己去解決的問題。比如說我們現在需要用到的 typescript 就是一個例子。

在 Node 裡面，我們有一個好用的套件管理工具 yarn，他的工作就是負責管理我們當前的專案需要哪些套件。我們可以從 yarn 的官方網站找到適合自己環境的版本並安裝。

安裝以後我們輸入查看版本的指令來確定是不是安裝成功了：

\`\`\`bash
➜ yarn -v
1.22.5
\`\`\`

如果看到版本號被正確印出來了，那麼我們就成功安裝好了！未來無論開發前端的路上需要什麼套件，大部分都可以在 yarn 上面找到並且直接加入到專案中。

所以我們現在馬上試著用 yarn 來安裝 typescript 套件吧：

➜ yarn global add typescript

注意到 這邊的 global 的意思是你要把這個套件直接安裝在電腦上，而沒有指定要裝在哪一個專案裡面（全域安裝），因為 typescript 是一個工具，我們未來很多專案都會用到，所以直接裝在電腦上可以一勞永逸。

    如果是之後在把套件安裝到專案裡面的話，不需要輸入 global，這樣 yarn 就會把這個套件安裝在目前位置的專案了。

安裝成功以後我們一樣檢查看看版本，確保已經安裝成功了：

➜ tsc -v
Version 4.0.2

第一個 Typescript 程式

接下來我們需要先開啟一個資料夾作為我們的專案資料夾，在本文用 example-typescript 為例。

    無論在進行什麼開發，以專案為單位來管理都是一個好習慣，不要把單獨的程式碼檔案散落在電腦的各個角落。

接下來我們用 vscode 開啟我們的 example-typescript 資料夾：
剛創立的資料夾，沒有任何檔案

接著我們在資料夾裡面新增一個 helloworld.ts 檔案 ，並且輸入和剛剛一樣的程式碼：

    沒有錯，就像 javascript 的副檔名是 .js， typescript 的副檔名就是 .ts，很好記吧！

接下來，我們不能直接用 node 去跑這個 .ts 檔 ，因為如果裡面有一些 typescript 特有的語法的話， node 把他當成 javascript 去解讀，會發生錯誤的！

因此，我們可以透過上一個章節安裝的 typescript 套件去對我們的 ts 檔做一個處理 ：

➜ tsc helloworld.ts

tsc 指令幫我們把 typescript 程式翻譯成 javascript 了

輸入指令後你應該會注意到，我們的專案目錄自動生成了一個同名的 .js 文件！這個檔案其實就是 tsc 這個指令幫我們把 ts 檔案翻譯成了 js 檔案。

現在 node 看的懂我們的程式啦！我們就直接讓 node 執行看看吧：

➜ node helloworld.js
hello, world

翻譯成 js 檔案後，node 就可以運行了

恭喜你！現在你已經懂得如何在電腦上建立一個 typescript 的開發環境了，你可以創立一個 ts 檔 ，並且透過 tsc 指令來把他轉換為等價的 js 檔案，最後讓 node 運行你的程式。

未來無論我們用多複雜、多高端的套件進行開發，只要是 typescript 語言，都會經過上述的一個轉化過程（雖然套件可能自動幫你完成了，所以你沒有感覺）。
為什麼要用 typescript ？

從上面給出的例子，你會發現相同的一段程式碼，可以同時是 javascript 也可以是 typescript。那麼我們為什麼要用 typescript 呢？

既然讀者已經同時能夠運行 javascript 和 typescript 的程式碼了，這邊給出以下兩段程式碼，請你們分別幫我用兩種語言運行看看：

var name = "Amy";
name = 87;

試試看，這段程式碼在 javascript 可以跑嗎？在 typescript 可以跑嗎？

var amy = {name: "Amy", gender: "female"};
amy.age = 19;

試試看，這段程式碼在 javascript 可以跑嗎？在 typescript 可以跑嗎？

希望這兩個問題能夠讓讀者快速理解 Typescript 和 Javascript 的差異，網路上也有非常多關於兩個語言的差別的文章，本文就不再贅述。

## 結語

在這篇文章中，我們學習了如何建立一個 Node.js 開發環境，同時也理解了 Typescript 的程式碼要如何被 Node 執行。

在下一篇文章中，我們將直接用 Typescript 說明這個語言的一些特色語法，包含了重要的箭頭函數 (arrow function) 用法以及 Promise 的異步處理。

《菜雞也看得懂的全端專案開發實作教學》是我把最近一年左右接觸到的開發技術用非常白話的方式寫成一個很詳細的系列，其中內容包含了前後端分離開發的基本概念、Django Rest Framwork + MongoDB 的後端開發、Docker 和 CircleCI 的自動化部署、React 以及 React Native 的前端開發等等，希望可以讓高中生、大學生甚至是已經出社會的人士，對開發有興趣卻不知道從哪裡下手的人們有一個入門的地方。

由於我也是從網路上反覆翻找大量資料，經過自己的解讀、理解以及實作後才打出這一系列的文章，難免可能會有觀念錯誤的部分，還請各位讀者可以向我指出，讓我有一個成長學習的機會 👍

如果你也是對專案開發有興趣的同學，或是正在跟著我們的系列教學，歡迎你加入我們 Chief Noob 的 Discord 菜雞開發社群，一起討論和互相學習：

如果你喜歡我的文章，希望你可以給我一個 Clap 以及留言，這是對我持續創作的一個重要動力！
`
};
