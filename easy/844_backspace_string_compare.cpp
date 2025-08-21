class Solution {
public:
    bool backspaceCompare(string s, string t) {
        int flag=0;
       stack<char>s1,s2;
        for(int i=0;i<s.size();i++){
            if(s[i]=='#' and !s1.empty())
                s1.pop();
            else if(s[i]!='#')
            s1.push(s[i]);
        }
        for(int i=0;i<t.size();i++){
            if(t[i]=='#' and !s2.empty())
                s2.pop();
            else if(t[i]!='#')
            s2.push(t[i]);
        }
        int y=s1.size();
         if(s1.size()==s2.size() and s1.size()==0)
             flag=1;
         else if(s1.size()==s2.size()){
            for(int i=0;i<y;i++){
                if(s1.top()==s2.top()){
                    s1.pop();
                    s2.pop();
                    flag=1;
                }
                else if(s1.top()!=s2.top())
                { flag=0;
                 break;}
            }
        }
        if(flag==1)
            return true;
        else 
            return false;
    }
};