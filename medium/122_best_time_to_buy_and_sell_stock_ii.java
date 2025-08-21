class Solution {
    public int maxProfit(int[] prices) {
        int maxProfit=0;
        int res=0;
        int flag=0;
        int cheapestPrice=prices[0];
        for(int i=1;i<prices.length;i++){
            if(prices[i]-cheapestPrice>maxProfit){
                maxProfit=prices[i]-cheapestPrice;
                flag=1;
            }
            else{
                res+=maxProfit;
                maxProfit=0;
                cheapestPrice=prices[i];
                flag=0;
            }
        }
        if(flag==1){
            res+= maxProfit;
        }
        return res;
    }
}