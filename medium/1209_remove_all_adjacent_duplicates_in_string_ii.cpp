class Solution {
public:
    string removeDuplicates(string s, int k) {
        stack<pair<char, int> > st;
        string str;
        for(int i=0;i<s.size();i++)
        {
            if(!st.empty() and st.top().first==s[i])
                st.push({s[i],st.top().second+1});
            else
                st.push({s[i],1});
            if(st.top().second==k)
            { 
                int p=k;
                while(p--)
                st.pop();
            }
        }
        
         while(!st.empty())
         {
            str.push_back(st.top().first);
            st.pop();
         }
          reverse(str.begin(),str.end());
          return str;
    }
};