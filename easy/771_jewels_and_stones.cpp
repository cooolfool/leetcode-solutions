class Solution {
public:
    int numJewelsInStones(string jewels, string stones) {
        int h[125]={0},count=0;
      for(int i=0;i<jewels .size();i++){
         
              h[jewels[i]]++;
          
        }
        for(int i=0;i<stones.size();i++){
           if(h[stones[i]]>=1)
               count++;
        }
        return count;
    }
};