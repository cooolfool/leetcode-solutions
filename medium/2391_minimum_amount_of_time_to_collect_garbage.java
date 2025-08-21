class Solution {
    public int garbageCollection(String[] garbage, int[] travel) {
        int minutes=0;
        int len_garbage=garbage.length;
        int len_travel=travel.length;
        int count=0;
        int int_p=1;
            int int_g=1;
            int int_m=1;
            int index_p=0;
            int index_g=0;
            int index_m=0;
            int p=0;
            int g=0;
            int m=0;
    int sum=0;
        // for(int i=0;i<len_garbage;i++){
            
        //     minutes+=garbage[i].length();
        //     if(garbage[i].contains("P") && int_p==1){
        //     count++;
        //     int_p++;
        //     }
        //      if(garbage[i].contains("G") && int_g==1){
        //     count++;
        //     int_g++;
        //      }
        //      if(garbage[i].contains("M") && int_m==1){
        //     count++;
        //     int_m++;
        //      }
        // }
        for(int i=len_garbage-1;i>=0;i--){
            if(garbage[i].contains("P") && p==0){
                index_p=i;
                p=1;

            }
            if(garbage[i].contains("G") && g==0){
                index_g=i;
                g=1;
            }
            if(garbage[i].contains("M") && m==0){
                index_m=i;
                m=1;
            }
        }
        for(int i=0;i<len_garbage;i++){
            sum+=garbage[i].length();
        }


        for(int i=0;i<index_p;i++){
            sum+=travel[i];
        }
        for(int i=0;i<index_g;i++){
            sum+=travel[i];
        }
        for(int i=0;i<index_m;i++){
            sum+=travel[i];
        }

        return sum;
        // for(int i=0;i<len_travel;i++){
        //     sum+=travel[i];
        // }
        // sum*=count;
        // return minutes+sum;
    }
}