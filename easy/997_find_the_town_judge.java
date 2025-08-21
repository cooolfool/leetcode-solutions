class Solution {
    public int findJudge(int n, int[][] trustt) {
        
        Map<Integer,Integer> mp=new HashMap();
        if(n==1)
        return 1;
        for(int i=0;i<trustt.length;i++){
            if(mp.containsKey(trustt[i][1])){
                mp.put(trustt[i][1],mp.get(trustt[i][1])+1);
            }
            else{
                mp.put(trustt[i][1],1);
            }
           // if(mp.containsKey(trustt[i][0]))
            mp.put(trustt[i][0],-10000);
        }

        for(Map.Entry<Integer,Integer> entry : mp.entrySet()){
            if(entry.getValue()>=n-1){
                return entry.getKey();
            }

        }
        return -1;

    }
}