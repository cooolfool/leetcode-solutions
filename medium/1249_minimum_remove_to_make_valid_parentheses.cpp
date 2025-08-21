class Solution {
public:
    string minRemoveToMakeValid(string s) {
       stack<pair<char,int>> st; 
       for(int i=0;i<s.size();i++)
       {
          if(s[i]=='(')
               st.push(make_pair(s[i],i));
           else if((st.empty() or st.top().first==')') and s[i]==')')
               st.push(make_pair(s[i],i));
           else if(!st.empty() and s[i]==')' and st.top().first=='(')
               st.pop();   
       }
        while(!st.empty())
        {
            int k=st.top().second;
           // cout<<st.top().first<<" "<<st.top().second<<endl;
            s.erase(s.begin()+k);
                st.pop();
        }
        return s;
    }
};