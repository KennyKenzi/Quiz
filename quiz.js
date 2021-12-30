var main = (function(){

    var Questions = function(id, question, options, answer){

        this.id = id
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
    
    var questArr = []
    var scoreTotal = 0 
    var corrTotal = 0
   
    return{

        splitOptions: function(options){

            //split options
            var unTrimmed = options.split(',')

            //trim white spaces
            var unFiltered = unTrimmed.map(el=>{
                return el.trim()
            })

            //filter out empty string
            var optArr = unFiltered.filter(function (el) {
                return el != "" || undefined;
            });


            return{
             optArr: optArr,
             length: optArr.length
            }

        },

        storeQuest: function(quest, options, answer){
            if(quest !== undefined){

            var ID, curr
            
            ID = (questArr.length)
            curr = new Questions(ID, quest, options, answer)
            questArr.push(curr)
            
            }

                return  questArr
                
        },

        getRandObj: function(totArr){

            var rand, obj,randAns,randOpt,randQuest, randID

            rand = Math.floor((Math.random()*totArr.length));

            obj = totArr[rand]

            randID=obj.id
            randQuest= obj.question
            randOpt = obj.options
            randAns= obj.answer
         
         
            return{   
                randQuest, randOpt, randAns, randID
            }
 
        },

        checkAnswer: function(respArr,ans){
            var count = 0
            var correct

            for(var i=0; i<respArr.length; i++){
                if(respArr[i] === true){
                    count ++;
                }else { } 
            }

            if (count === 1){
                if(respArr[ans-1] === true){
                    correct = true
                }else{
                    correct = false
                }

            }else{
                correct = false
            }
            return correct
            
        },

        clearScore: function(){
            scoreTotal = 0
            corrTotal = 0
        },

        keepScore: function(corr){

            if (corr === true){
                scoreTotal++
                corrTotal++
            }else{
                scoreTotal++
            }

            return {
                scoreTotal,
                corrTotal
            }
        }

    }

})()


var uicontroller = (function(){

    var DOMList = {
        question_field : '.question_field',
        option_field: '.option_field',
        answer_field: '.answer_field',
        tablinks_quest:'.tablinks_quest',
        tablinks_quiz: '.tablinks_quiz',
        save_quest: '.save_quest',  
        clear_quest: '.clear_quest',
        start_quiz: 'start_quiz',
        set_quest:'set_quest',
        question_count: '.question_count',
        quest_contain: '.quest_contain',
        opt_contain:'.opt_contain',
        option_container:'.option_container',
        option_container_id:'option_container',
        questdisplayed:'question',
        options:'options',
        current_question: 'curr_quest',
        next_button:'#next_button',
        final:'.final',
        score: '.score',
        final: '.final',
        grade: '#grade',
        correctNumber: '.correctNumber'

    }

    return{
        DOMs: function(){
            return DOMList
        },

        getInput: function(){

            return{
                quest: document.querySelector(DOMList.question_field).value,
                options:document.querySelector(DOMList.option_field).value,
                answer:document.querySelector(DOMList.answer_field).value
            }
        },

        clearInput: function(){

            document.querySelector(DOMList.question_field).value = ""
            document.querySelector(DOMList.option_field).value = ""
            document.querySelector(DOMList.answer_field).value = ""
            
        },

        displayQuest: function(question, options, ans){

           

            var htmlq, htmlo, newhtmlo, newhtmlq

            htmlq = '<div class="question h1 text-primary" id="curr_quest">&question&</div>' ;
            htmlo = '<input type="radio" class="options" id="id-&id&">&option&</input><br>';


                newhtmlq = htmlq.replace('&question&', question);
                document.querySelector(DOMList.quest_contain).insertAdjacentHTML('beforeend', newhtmlq)
    
                options.forEach((element,index) => { 
                    newhtmlo = htmlo.replace('&option&', element)
                    newhtmlo = newhtmlo.replace('&id&', index)
                    document.querySelector(DOMList.option_container).insertAdjacentHTML('beforeend', newhtmlo)
                });
    
                return{
                    question, options, ans
                }
           

        },

        answerLimit: function(){
            var correctNum = document.querySelector(DOMList.correctNumber).value

            return correctNum
        },

        displayScore: function(correctScore){

            document.querySelector(DOMList.score).value = correctScore
        },

        removeCurr: function(){
            var el1 = document.getElementById(DOMList.current_question)
            el1.parentNode.removeChild(el1)

            var el2 =document.getElementById(DOMList.option_container_id)
            while(el2.firstChild){
                el2.removeChild(el2.firstChild)
            }
        },

        getResponse: function(){
            var len, id, opt, respArr
            respArr = []
            
            len = document.getElementsByClassName(DOMList.options).length
            
            for (var i=0; i<len; i++){
                id = 'id-'+i
                opt = document.getElementById(id).checked
                respArr.push(opt) 

            }
            return respArr
            
        }

    }


})()



var controller = (function(first, uicon){


    
    var domAccess = uicon.DOMs()
    var rands,  alls, counter
    var finalScoreUp = false

    var eventhandler = function(){
        //click Question tab
        document.querySelector(domAccess.tablinks_quest).addEventListener('click', clickQuest)
        //click quiz tab
        document.querySelector(domAccess.tablinks_quiz).addEventListener('click', clickQuiz)
        //click save button
        document.querySelector(domAccess.save_quest).addEventListener('click', saveIt )
        //click save button
        document.querySelector(domAccess.clear_quest).addEventListener('click', clearIt )
        //click  next question
        document.querySelector(domAccess.next_button).addEventListener('click', nextQuest )
    }

    var clickQuest = function(){
        //click quest tab
        if(finalScoreUp == true){
            document.querySelector(domAccess.final).style.display = 'none';
            finalScoreUp = false
        }
        document.getElementById(domAccess.start_quiz).style.display = 'none';
        
        document.getElementById(domAccess.set_quest).style.display = 'block';
       
    }

    var nextQuest = function(){
       var resp, corr, score
       
       //get response from radio buttons
       resp = uicon.getResponse()
       
       //check if answer is correct
       corr = first.checkAnswer(resp, rands.randAns)

       //keep score
       score = first.keepScore(corr)

       //display Score
       uicon.displayScore(score.corrTotal)


        if (score.corrTotal < uicon.answerLimit()){

            nxtQ()

        }else {
            finalScoreUp = true
            document.getElementById(domAccess.start_quiz).style.display = 'none';

            var html = '<div class="final" id="grade">Your Score is <div class="text-&color&">&Placeholder&</div></div>'
            var calcScore = ((score.corrTotal/score.scoreTotal)*100).toFixed(2)
            var newColor = calcScore>50 ?'success' : 'danger'
            var newhtml = html.replace('&Placeholder&', ' '+calcScore+'%')
            newhtml = newhtml.replace('&color&', newColor)
            document.querySelector('.tabs_container').insertAdjacentHTML('beforeend', newhtml)
            
        }

    }

    var clickQuiz = function(){

        if(uicon.answerLimit()>0){

            if(finalScoreUp == true){
                document.querySelector(domAccess.final).style.display = 'none';
                finalScoreUp = false
            }
            
            first.clearScore()
            document.querySelector(domAccess.score).value = 0
            document.getElementById(domAccess.set_quest).style.display = 'none';
            document.getElementById(domAccess.start_quiz).style.display = 'block';
    
            nxtQ()

        }else{
            alert('Set a valid limit')
        }

        
    }


    //Save and store questions and answer
    var saveIt = function(){
        var inputs, splitsOpt
        //1. get inputs
        inputs = uicon.getInput()
           
        //2. split options
        splitsOpt = first.splitOptions(inputs.options)


        //2.5 make sure answer exists
        if(inputs.answer < 1 || inputs.answer > splitsOpt.length){

            alert('Something appears to be wrong with your answer')

        } else{
            
            if(inputs.quest !=="" && inputs.options!=="" && inputs.answer!==""){

                //3. store input
                alls = first.storeQuest(inputs.quest, splitsOpt.optArr, inputs.answer)

    
                //4. increase counter
                counter = parseInt(document.querySelector(domAccess.question_count).value) + 1
                document.querySelector(domAccess.question_count).value = counter
                //5. clear field
               // uicon.clearInput()
    
    
            }else{
                alert('Something appears to be wrong with your inputs')
            }
        }


        
      
    }

    var clearIt= function(){
        alls = [];
        counter = 0
        document.querySelector(domAccess.question_count).value = counter
        //clear field
        uicon.clearInput()
    }


    //shows next question at random
    var nxtQ = function(){

        if(alls){
            //clear all and start again
            uicon.removeCurr()
        
            //get rand obj
            rands = first.getRandObj(alls)
        
            //display quetsion and options
            uicon.displayQuest(rands.randQuest, rands.randOpt, rands.randAns) 
        } 
    }
    
    return{
        init: function(){
            eventhandler()
            
        }
    }
    
    
})(main, uicontroller)

controller.init()