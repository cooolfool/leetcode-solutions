class Solution {
public:
    bool isValid(string s) {
       stack<char>st;
      for(int i=0;i<s.size();i++){
          if(st.empty())
              st.push(s[i]);
          else if(s[i]=='(' or s[i]=='[' or s[i]=='{')
              st.push(s[i]);
          else if(s[i]==')' and st.top()=='(')
              st.pop();
          else if(s[i]=='}' and st.top()=='{')
              st.pop();
          else if(s[i]==']' and st.top()=='[')
              st.pop();
          else 
              st.push(s[i]);
      }
        if(st.empty())
            return true;
        else 
            return false;
    }
};