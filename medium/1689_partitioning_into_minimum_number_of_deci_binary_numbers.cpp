class Solution {
public:
    int minPartitions(string n) {
        int res=0;
       for(int i=0;i<n.length();i++){
            int temp=n[i]-'0';
            if(temp>res)
                res=temp;
        }
        return res;
    }
};