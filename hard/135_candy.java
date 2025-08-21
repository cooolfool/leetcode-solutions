class Solution {
    public int candy(int[] ratings) {
        int sum=0;
        int len=ratings.length;
        int res[]=new int[len];
        Arrays.fill(res,1);
        // for(int i=1;i<=len-1;i++){
        //     if(ratings[i]>ratings[i-1]){
        //         res[i]=res[i-1]+1;
        //     }
        //     if(ratings[i]==ratings[i-1]){
        //         res[i]=res[i-1];
        //     }
        // }
        // for(int i=len-2;i>=0;i--){
        //     if(ratings[i]>ratings[i+1]){
        //         res[i]=res[i+1]+1;
        //     }
        // }

        for(int i=0;i<len-1;i++){
            if(ratings[i]<ratings[i+1]){
                res[i+1]=res[i]+1;
            }
        }

        for(int i=len-1;i>0;i--){
            if(ratings[i-1]>ratings[i] && res[i]>=res[i-1]){
                res[i-1]=res[i]+1;
            }
        }
        for(int a:res){
            sum+=a;
        }
        return sum;

    }
}