class Solution {
public:
    bool isPalindrome(int x) {
        string s=to_string(x);
        int size=s.length();
        if(size%2!=0){
           for(int i=0;i<size/2;i++){
            if(s[i]!=s[size-1-i])
                return false;
        }
            return true;
        }
        else{
            for(int i=0;i<=size/2-1;i++){
                 if(s[i]!=s[size-1-i])
                return false;
            }
            return true;
        }
    }
};