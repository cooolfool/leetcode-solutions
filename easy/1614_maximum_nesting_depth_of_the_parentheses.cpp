class Solution {
public:
    int maxDepth(string s) {
        stack<char> st;
        int res=0,max=0;
        for(int i=0;i<s.length();i++){
            if(s.at(i)=='('){
                res++;
                if(res>=max)
                    max=res;
            }
            if(s.at(i)==')'){
                res--;
            }
        }
        return max;
    }
};