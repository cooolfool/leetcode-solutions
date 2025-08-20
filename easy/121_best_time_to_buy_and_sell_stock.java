class Solution {
    public int maxProfit(int[] prices) {
        // int min=99999;
        // int max=-1;
        // int minPos=-1;
        // int maxPos=-1;
        // for(int i=0;i<prices.length;i++){
        //     if(prices[i]<min){
        //         min=prices[i];
        //         minPos=i;
        //     }
        //    if(prices[i]>max){
        //        if(i>minPos){
        //            max=prices[i];
        //            maxPos=i;
        //        }
        //    }
        // }
        // if(maxPos>minPos){
        // return max-min;
        // }
        // else{
        //     return 0;
        // }

        int maxProfit=0;
        int cheapestPrice=prices[0];
        for(int i=1;i<prices.length;i++){
            if(prices[i]-cheapestPrice>maxProfit){
                maxProfit=prices[i]-cheapestPrice;
            }
           if(cheapestPrice>prices[i]){
                cheapestPrice=prices[i];
            }
        }
        return maxProfit;
    }
}