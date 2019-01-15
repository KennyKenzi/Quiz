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
            var optArr
            optArr = options.split(',')

            return{
             optArr
            }

        },

        storeQuest: function(quest, options, answer){
            if(quest !== undefined){
            //console.log("function to store question was called");
            var ID, curr
            
            ID = (questArr.length)
            curr = new Questions(ID, quest, options, answer)
            questArr.push(curr)
            
            }
            //console.log(questArr)
                return  questArr
                
        },

        getRandObj: function(totArr){
            //console.log(totArr)
            //console.log("array length: "+totArr.length)
            var rand, obj,randAns,randOpt,randQuest, randID

            rand = Math.floor((Math.random()*totArr.length));
            //console.log('randomly generated number: '+rand)
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

        keepScore: function(corr){
            // console.log('show if correct is true or false')
            // console.log(corr)
            if (corr === true){
                scoreTotal++
                corrTotal++
            }else{
                scoreTotal++
            }

           console.log(scoreTotal, corrTotal)
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
        final:'.final'

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

        displayQuest: function(question, options, ans){


            var htmlq, htmlo, newhtmlo, newhtmlq

            htmlq = '<div class="question" id="curr_quest">&question&</div>' ;
            htmlo = '<input type="radio" class="options" id="id-&id&">&option&</input><br>';

            newhtmlq = htmlq.replace('&question&', question);
            document.querySelector(DOMList.quest_contain).insertAdjacentHTML('beforeend', newhtmlq)
            // console.log(options)
            // console.log(options.length)

            options.forEach((element,index) => { 
                newhtmlo = htmlo.replace('&option&', element)
                newhtmlo = newhtmlo.replace('&id&', index)
                document.querySelector(DOMList.option_container).insertAdjacentHTML('beforeend', newhtmlo)
            });

            return{
                question, options, ans
            }

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
    var rands,  alls

    var eventhandler = function(){
        //click Question tab
        document.querySelector(domAccess.tablinks_quest).addEventListener('click', clickQuest)
        //click quiz tab
        document.querySelector(domAccess.tablinks_quiz).addEventListener('click', clickQuiz)
        //click save button
        document.querySelector(domAccess.save_quest).addEventListener('click', saveIt )
        //click  next question
        document.querySelector(domAccess.next_button).addEventListener('click', nextQuest )
    }

    var clickQuest = function(){
        //click quest tab
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
       
       if (score.corrTotal < 5){
        nxtQ()
        }else {
            console.log('nope')
            document.getElementById(domAccess.start_quiz).style.display = 'none';

            var html = '<div class="final">&Placeholder&</div>'
            var calcScore = (score.corrTotal/score.scoreTotal)*100
            var newhtml = html.replace('&Placeholder&', 'Your Score is '+calcScore+'%')
            document.querySelector('.tabs_container').insertAdjacentHTML('beforeend', newhtml)
           

    }

    }

    var clickQuiz = function(){
        var tri
        document.getElementById(domAccess.set_quest).style.display = 'none';
        document.getElementById(domAccess.start_quiz).style.display = 'block';

        nxtQ()
    }



    var saveIt = function(){
        var inputs, splitsOpt, counter
        //1. get inputs
        inputs = uicon.getInput()

        if(inputs.quest !=="" && inputs.options!=="" && inputs.answer!==""){

            //2. split options
            splitsOpt = first.splitOptions(inputs.options)

            //3. store input
            alls = first.storeQuest(inputs.quest, splitsOpt.optArr, inputs.answer)
            //console.log('output from 1:'+alls)

            //4. increase counter
            counter = parseInt(document.querySelector(domAccess.question_count).value) + 1
            document.querySelector(domAccess.question_count).value = counter
            //

        }else{
            alert('Something appears to be wrong')
        }
      
    }
    var nxtQ = function(){
        //clear all and start again
        uicon.removeCurr()
        
        //get rand obj
        rands = first.getRandObj(alls)
        
        //display quetsion and options
        uicon.displayQuest(rands.randQuest, rands.randOpt, rands.randAns) 
        
    }


    return{
        init: function(){
            eventhandler()
            
        }
    }
    

})(main, uicontroller)

controller.init()